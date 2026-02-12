<div align="center">
  <img src="docs/images/logo.png" alt="KATANA Logo" width="300">
  <h1>KATANA - The Klipper Blade</h1>
</div>

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](LICENSE.txt)
[![Klipper](https://img.shields.io/badge/Klipper-Ecosystem-orange.svg)](https://www.klipper3d.org/)
[![Version](https://img.shields.io/badge/Version-v2.0-green.svg)]()
[![Platform](https://img.shields.io/badge/Platform-Raspberry%20Pi%20%7C%20Linux-lightgrey.svg)]()

> **"The sharpest tool in your 3D Printing Arsenal."**
> A modern, modular, and high-performance replacement for KIAUH.

---

## 📸 Screenshots

<div align="center">
  <img src="docs/images/screenshot.png" alt="KATANA Interface" width="600">
  <p><i>(Place your screenshot in `docs/images/screenshot.png` to see it here)</i></p>
</div>

---


## 🔥 Why KATANA?

KATANA is built for speed, stability, and control. It completely replaces legacy installers with a professional architecture.

| Feature | ⚔️ KATANA v2.0 | 🐢 Legacy (KIAUH) |
| :--- | :--- | :--- |
| **Architecture** | **Modular & Clean** | Monolithic Spaghetti |
| **Engine Switching** | **Seamless (Klipper ↔ Kalico)** | ❌ Not available |
| **Flow Control** | **Auto-Adaptive Purge & Park** | ❌ Manual Config only |
| **Hardware Tool** | **The Forge (Auto-Flash)** | ⚠️ Basic Functions |
| **Diagnostics** | **Dr. KATANA Log Analysis** | ❌ None |
| **Backup** | **Vault (Auto-Backup & Rollback)** | ⚠️ Basic |

---

## 🚀 Quick Start

Get started in seconds. Open your terminal on your Raspberry Pi:

```bash
git clone https://github.com/Extrutex/KATANA-Klipper-Installer.git
cd KATANA-Klipper-Installer
./katana.sh
```

---

## 🛠️ The Arsenal (Features)

### 1. 🧠 Core Engine
*   **Auto-Pilot:** Install Klipper, Moonraker, Mainsail & Crowsnest with one click.
*   **Engine Manager:** Switch between **standard Klipper** and **Kalico (High-Speed)** instantly without losing your config.

### 2. ⚡ KATANA-FLOW
*   **Smart Park:** Automatically parks the print head near the object.
*   **Adaptive Purge:** Purges exactly as much generic filament as needed, right before the print.

### 3. 🔥 THE FORGE
*   **USB & CAN Scanner:** Detects your MCU automatically.
*   **Flash Wizard:** Interactive firmware builder and flasher.
*   **CanNet:** Initializes CAN0 networks in seconds.

### 4. 🩺 Dr. KATANA
*   **Log Doctor:** Scans your `klippy.log` for MCU shutdowns, timer too close errors, and heater faults. Gives you human-readable solutions.

### 5. 🛡️ Security & Vault
*   **Hardening:** UFW Firewall configuration.
*   **Backup Manager:** Automated cron-job backups of your `printer_data`.

---

## � Screenshots

*(Screenshots coming soon)*

---

## 🤝 Contributing

This project is open source. Feel free to open issues or pull requests.

*Built with ❤️ for the Voron & Klipper Community.*
