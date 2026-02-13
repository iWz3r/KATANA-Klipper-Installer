# Skill: Testing Strategy (Docker + Raspberry Pi)

## Level 1 – Container/CI (Fast Feedback)
Ziel:
- Syntax/Lint (Shellcheck, basic sanity)
- Template/Config Rendering
- ungefährliche “dry-run” Pfade

Docker ersetzt keine echte Hardwarevalidierung.

## Level 2 – Raspberry Pi (Pflicht)
Ziel:
- systemd läuft echt
- journald logs sind korrekt
- ports sind korrekt gebunden
- Moonraker API erreichbar
- Klippy State korrekt
- Pi Metrics (CPU Temp) verfügbar

## Commands
- systemctl status/start/restart <services>
- journalctl -u <service> -n 200 --no-pager
- curl Moonraker (server.info)
- ss -lntp (port check)
- vcgencmd measure_temp (Pi)
