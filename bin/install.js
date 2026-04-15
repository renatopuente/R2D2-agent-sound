#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

// Si se llama como: npx @renatopuente/r2d2-agent-sound r2d2-uninstall
if (process.argv[2] === 'r2d2-uninstall') {
        require(path.join(__dirname, 'uninstall.js'));
        process.exit(0);
}

const isWindows = process.platform === 'win32';

if (!isWindows) {
    console.error('❌ Este hook solo funciona en Windows (usa PowerShell MediaPlayer).');
    console.error('   Para macOS/Linux, adapta el comando a `afplay` o `mpg123`.');
    process.exit(1);
}

// 1. Copiar los MP3 a ~/sounds/
const soundsDir = path.join(os.homedir(), 'sounds');
if (!fs.existsSync(soundsDir)) {
    fs.mkdirSync(soundsDir, { recursive: true });
}

const soundFiles = ['R2D2_A.mp3', 'R2D2_B.mp3'];

for (const soundFile of soundFiles) {
    const src = path.join(__dirname, '..', soundFile);
    const dest = path.join(soundsDir, soundFile);

  if (!fs.existsSync(src)) {
        console.error(`❌ No se encontró ${soundFile} en el paquete.`);
        process.exit(1);
  }

  fs.copyFileSync(src, dest);
}

// 2. Construir URIs de los archivos (barras forward para PowerShell)
const mp3UriA = 'file:///' + path.join(soundsDir, 'R2D2_A.mp3').replace(/\\/g, '/');
const mp3UriB = 'file:///' + path.join(soundsDir, 'R2D2_B.mp3').replace(/\\/g, '/');

// 3. Leer settings.json existente
const settingsPath = path.join(os.homedir(), '.claude', 'settings.json');
let settings = {};
if (fs.existsSync(settingsPath)) {
    try {
          settings = JSON.parse(fs.readFileSync(settingsPath, 'utf8'));
    } catch (e) {
          console.error('⚠️ settings.json existente tiene JSON inválido. Creando backup...');
          fs.copyFileSync(settingsPath, settingsPath + '.bak');
    }
}

// 4. Construir entrada del hook con selección aleatoria entre R2D2_A y R2D2_B
const hookCommand =
    `$sounds = @('${mp3UriA}', '${mp3UriB}'); ` +
    `$uri = $sounds | Get-Random; ` +
    `Add-Type -AssemblyName presentationCore; ` +
    `$mp = New-Object system.windows.media.mediaplayer; ` +
    `$mp.open([uri]$uri); ` +
    `$mp.Volume = 1.0; ` +
    `$mp.Play(); ` +
    `Start-Sleep 4`;

const hookEntry = {
    matcher: '',
    hooks: [
      {
              type: 'command',
              command: hookCommand,
              shell: 'powershell',
              async: true,
      },
        ],
};

// 5. Inyectar hooks (sin pisar los existentes de otros eventos)
if (!settings.hooks) settings.hooks = {};
settings.hooks.PermissionRequest = [hookEntry];
settings.hooks.Stop = [hookEntry];

// 6. Guardar settings.json
const claudeDir = path.join(os.homedir(), '.claude');
if (!fs.existsSync(claudeDir)) {
    fs.mkdirSync(claudeDir, { recursive: true });
}
fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2), 'utf8');

console.log('');
console.log('✅ R2D2 sound hook instalado correctamente!');
console.log('');
console.log(' 🔊 Sonidos guardados en : ' + soundsDir);
console.log(' ⚙️  Settings en         : ' + settingsPath);
console.log('');
console.log(' El sonido (R2D2_A o R2D2_B aleatorio) se reproducirá cuando Claude:');
console.log(' • Solicite permiso para ejecutar una herramienta (PermissionRequest)');
console.log(' • Termine de responder y espere tu input (Stop)');
console.log('');
console.log(' Reinicia Claude Code para aplicar los cambios.');
console.log('');
