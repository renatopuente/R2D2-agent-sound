#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const isWindows = process.platform === 'win32';

if (!isWindows) {
  console.error('❌ Este desinstalador solo funciona en Windows.');
  process.exit(1);
}

const settingsPath = path.join(os.homedir(), '.claude', 'settings.json');
const mp3Dest = path.join(os.homedir(), 'sounds', 'Fahhh.mp3');

// 1. Eliminar hooks de settings.json
if (fs.existsSync(settingsPath)) {
  let settings = {};
  try {
    settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
  } catch (e) {
    console.error('❌ No se pudo leer settings.json:', e.message);
    process.exit(1);
  }

  let removed = false;

  if (settings.hooks) {
    if (settings.hooks.PermissionRequest) {
      settings.hooks.PermissionRequest = settings.hooks.PermissionRequest.filter(
        entry => !JSON.stringify(entry).includes('Fahhh')
      );
      if (settings.hooks.PermissionRequest.length === 0) {
        delete settings.hooks.PermissionRequest;
      }
      removed = true;
    }

    if (settings.hooks.Stop) {
      settings.hooks.Stop = settings.hooks.Stop.filter(
        entry => !JSON.stringify(entry).includes('Fahhh')
      );
      if (settings.hooks.Stop.length === 0) {
        delete settings.hooks.Stop;
      }
      removed = true;
    }

    if (Object.keys(settings.hooks).length === 0) {
      delete settings.hooks;
    }
  }

  if (removed) {
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf8');
    console.log('✅ Hooks de Fahhh eliminados de:', settingsPath);
  } else {
    console.log('ℹ️  No se encontraron hooks de Fahhh en settings.json');
  }
} else {
  console.log('ℹ️  No existe settings.json, nada que limpiar.');
}

// 2. Eliminar el MP3
if (fs.existsSync(mp3Dest)) {
  fs.unlinkSync(mp3Dest);
  console.log('✅ MP3 eliminado:', mp3Dest);

  const soundsDir = path.dirname(mp3Dest);
  if (fs.existsSync(soundsDir) && fs.readdirSync(soundsDir).length === 0) {
    fs.rmdirSync(soundsDir);
    console.log('✅ Carpeta sounds/ eliminada (estaba vacía)');
  }
} else {
  console.log('ℹ️  No se encontró el MP3 en:', mp3Dest);
}

console.log('');
console.log('🗑️  Fahhh sound hook desinstalado correctamente.');
console.log('   Reinicia Claude Code para aplicar los cambios.');
console.log('');
