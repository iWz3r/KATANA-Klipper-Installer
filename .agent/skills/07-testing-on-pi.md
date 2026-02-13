# Skill: Testing Strategy (Docker + Raspberry Pi)

## Test Ebenen

### Level 1 – Container Test (CI / Fast Feedback)

Ziel:
- Shell Syntax valid
- Templates rendern korrekt
- Idempotenz-Checks funktionieren
- Keine riskanten File-Operations

Tools:
- shellcheck
- bash -n
- unit template dry-run

### Level 2 – Real Raspberry Pi Test (Pflicht)

Ziel:
- systemd Services laufen stabil
- journald Logs korrekt
- Ports korrekt gebunden
- Moonraker API erreichbar
- CPU Temp & Systemmetrics verfügbar
- Klippy Status korrekt

Commands:
- systemctl status/start/restart
- journalctl -u ... -n 200 --no-pager
- curl http://localhost:<port>/server/info
- ss -lntp
- vcgencmd measure_temp (Pi)

## Regel

Docker ersetzt keinen echten Raspberry Pi Test.
Finale Validierung muss immer auf echter Hardware erfolgen.
