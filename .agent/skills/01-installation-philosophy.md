# Skill: Installation Philosophy (KIAUH überlegen)

## Ziel
Installer muss:
- install / update / repair / uninstall unterstützen
- states sicher erkennen (installed? version? services? ports?)
- mehrfach ausführbar sein (idempotent)

## Regeln
- nie blind überschreiben → backups
- klare state detection vor action
- jedes Feature muss testbar sein (smoke test)
