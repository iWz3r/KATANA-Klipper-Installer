# Skill: Logs & Diagnostics

## Pflicht-Logs
- Installer: /var/log/katana/installer.log
- Services: component logs + journald

## Diagnose Bundle (Feature)
Ein Kommando sammelt:
- system info (OS, arch, uptime)
- service status
- letzte Logs (200 lines)
- configs (redacted wenn nötig)
- port listing (ss -lntp)

## Debug Pattern
1) systemctl status <service>
2) journalctl -u <service> -n 200 --no-pager
3) port conflicts: ss -lntp
4) permissions + paths prüfen 

## Regeln
- Logs niemals im Code-Ordner verstecken
- Backups timestamped
- Uninstall löscht keine Backups ungefragt

---
## Debug Pattern 

1) systemctl status <service>
2) journalctl -u <service> -n 200 --no-pager
3) port conflicts: ss -lntp
4) permissions + paths prüfen 

## Fehlerbehandlung

Bei:

- Websocket nicht erreichbar
- Klippy disconnected
- Config Fehler
- Port Konflikt

muss KATANA:
- Diagnose anzeigen
- Logs bereitstellen
- Repair Option anbieten    

