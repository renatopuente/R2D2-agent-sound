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
const soundsDir = path.join(os.homedir(), 'sounds');
const soundFiles = ['R2D2_A.mp3', 'R2D2_B.mp3'];

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
                          entry => !JSON.stringify(entry).includes('R2D2')
                        );
                if (settings.hooks.PermissionRequest.length === 0) {
                          delete settings.hooks.PermissionRequest;
                }
                removed = true;
        }

      if (settings.hooks.Stop) {
              settings.hooks.Stop = settings.hooks.Stop.filter(
                        entry => !JSON.stringify(entry).includes('R2D2')
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
        console.log('✅ Hooks de R2D2 eliminados de:', settingsPath);
  } else {
        console.log('ℹ️ No se encontraron hooks de R2D2 en settings.json');
  }
} else {
    console.log('ℹ️ No existe settings.json, nada que limpiar.');
}

// 2. Eliminar los MP3
for (const soundFile of soundFiles) {
    const mp3Dest = path.join(soundsDir, soundFile);
    if (fs.existsSync(mp3Dest)) {
          fs.unlinkSync(mp3Dest);
          console.log('✅ MP3 eliminado:', mp3Dest);
    } else {
          console.log('ℹ️ No se encontró el MP3 en:', mp3Dest);
    }
}

// 3. Eliminar carpeta sounds/ si quedó vacía
if (fs.existsSync(soundsDir) && fs.readdirSync(soundsDir).length === 0) {
    fs.rmdirSync(soundsDir);
    console.log('✅ Carpeta sounds/ eliminada (estaba vacía)');
}

console.log('');
console.log('🗑️ R2D2 sound hook desinstalado correctamente.');
console.log(' Reinicia Claude Code para aplicar los cambios.');
console.log('');
