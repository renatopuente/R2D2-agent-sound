# Fahhh Agent Sound — Hook para Claude Code

Reproduce un sonido personalizado (`Fahhh.mp3`) en Claude Code cuando:

- **Claude solicita permiso** para ejecutar una herramienta (`PermissionRequest`)
- **Claude termina de responder** y espera tu input (`Stop`)

## Requisitos

- Windows 10/11
- Claude Code
- PowerShell (incluido en Windows)
- Node.js (para instalación vía npm)

## Instalación rápida (recomendada)

```bash
npx @renatopuente/fahhh-agent-sound
```

Esto descarga e instala el paquete automáticamente sin necesidad de clonar el repositorio.

## El instalador:

1. Copia `Fahhh.mp3` a `~/sounds/`
2. Agrega los hooks automáticamente a `~/.claude/settings.json`
3. Muestra la ruta del MP3 y los eventos configurados

Reinicia Claude Code después de instalarlo.

## Desinstalación

```bash
npx @renatopuente/fahhh-agent-sound fahhh-uninstall
```

O si ya instalaste el paquete globalmente:

```bash
fahhh-uninstall
```

### El desinstalador:

1. Elimina los hooks de Fahhh de `~/.claude/settings.json` (sin tocar otros hooks)
2. Borra `~/sounds/Fahhh.mp3`
3. Elimina `~/sounds/` si quedó vacía

Reinicia Claude Code después de desinstalarlo.

## Instalación manual

1. Clona o descarga este repositorio.
2. Copia `Fahhh.mp3` a una carpeta de tu preferencia (ej. `C:\sounds\`).
3. Abre el archivo de configuración global de Claude Code:

```
C:\Users\<TuUsuario>\.claude\settings.json
```

4. Agrega los siguientes hooks dentro de la clave `"hooks"` (ajusta la ruta del MP3):

```json
"hooks": {
  "PermissionRequest": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "Add-Type -AssemblyName presentationCore; $mp = New-Object system.windows.media.mediaplayer; $mp.open([uri]'file:///C:/sounds/Fahhh.mp3'); $mp.Volume = 1.0; $mp.Play(); Start-Sleep 4",
          "shell": "powershell",
          "async": true
        }
      ]
    }
  ],
  "Stop": [
    {
      "matcher": "",
      "hooks": [
        {
          "type": "command",
          "command": "Add-Type -AssemblyName presentationCore; $mp = New-Object system.windows.media.mediaplayer; $mp.open([uri]'file:///C:/sounds/Fahhh.mp3'); $mp.Volume = 1.0; $mp.Play(); Start-Sleep 4",
          "shell": "powershell",
          "async": true
        }
      ]
    }
  ]
}
```

## Personalización

- **Volumen:** Cambia `$mp.Volume = 1.0` a cualquier valor entre 0.0 y 1.0.
- **Sonido:** Reemplaza `Fahhh.mp3` con cualquier archivo MP3 que quieras usar.
- **Disparador:** Elimina el bloque `PermissionRequest` o `Stop` si solo quieres uno de los dos.

## Cómo funciona

Claude Code soporta hooks — comandos de shell que se ejecutan en eventos específicos del ciclo de vida del agente. Este paquete usa `System.Windows.Media.MediaPlayer` de PowerShell para reproducir un MP3 de forma asíncrona cuando Claude necesita tu atención.

---

Hecho por [@renatopuente](https://github.com/renatopuente)
