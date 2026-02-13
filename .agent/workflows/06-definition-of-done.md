---
description: finition of Done (KATANA + HORIZON)
---

# Definition of Done (KATANA + HORIZON)

## Allgemein
- Keine Annahmen ohne Validierung (siehe rules/08-no-assumption-rule.md)
- README.md: nur Append am Ende, keine Stil-/Strukturänderung
- Bestehende Shell-Skripte: nicht refactoren, nur additiv erweitern

## Installer/Orchestrator (KATANA)
- Install ist idempotent (2x ausführen -> gleicher stabiler Zustand)
- Repair existiert und behebt mind.:
  - service down
  - port conflict detection (anzeigen)
  - config parse errors (anzeigen)
- Uninstall entfernt Services und Artefakte, Backups bleiben erhalten
- Diagnose-Bundle erzeugbar (Status, Logs, Ports, Versions)

## Frontend (HORIZON)
- Alle UI-States sind durch Moonraker/Websocket/Checks belegt
- Offline/Disconnect Zustand sichtbar + funktionale Degradation
- Performance: keine “infinite rerenders”, keine unbounded logs/lists
- Layout ist anpassbar (Widgets verschiebbar, Größen, Presets, persistiert)
- Fehler sind strukturiert (Error Center) und exportierbar
