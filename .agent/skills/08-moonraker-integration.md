# Skill: Moonraker Integration (Core Skill)


---
trigger: always_on
---



## Ziel

Moonraker ist die Runtime-API.
KATANA muss Installation, Konfiguration, Update und Recovery vollständig beherrschen.

## Installer-Aufgaben

- Python venv erstellen
- Moonraker Repo klonen
- requirements installieren
- moonraker.conf generieren
- systemd Unit erstellen
- Service enable + start

## Konfigurationsstruktur

- Config: /etc/katana/moonraker.conf
- Log: /var/log/katana/moonraker.log
- Venv: /opt/katana/moonraker-env
- Source: /opt/katana/moonraker

## Muss überwachte Metriken (wie Mainsail)

- CPU Usage
- RAM Usage
- Disk Usage
- Hostname
- IP-Adresse
- Uptime
- CPU Temperatur (Raspberry Pi)
- Klippy State

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
