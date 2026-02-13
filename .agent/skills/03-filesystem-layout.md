# Skill: Filesystem Layout

## Muss
- Layout sauber erzeugen/aktualisieren
- Permissions prüfen
- Backup-Strategie dokumentieren
- idempotent

## Debug Pattern
1) ls -la
2) diff <old> <new>
3) permissions + paths prüfen   


## Standardpfade (empfohlen)
- Code/Binaries: /opt/katana/<component>
- Config: /etc/katana/<component>.conf
- Runtime/State: /var/lib/katana/
- Logs: /var/log/katana/<component>.log

## Regeln
- Konfiguration niemals im Code-Ordner verstecken
- Backups timestamped
- Uninstall löscht keine Backups ungefragt
