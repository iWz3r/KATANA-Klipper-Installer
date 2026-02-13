# Changelog

All notable changes to this project will be documented in this file.

## [v1.0.0-rc1] - 2026-02-13

### Added
- **HORIZON UI (Phase 2)**: 
  - Complete "Cyber/Techno" React-based web interface.
  - Replaces pure text-based installers with a visual dashboard.
  - **Modules**: Dashboard, Console, Files, Config, System.
- **Direct System Integration**:
  - `SystemHealth` Monitor: Real-time CPU, RAM, Disk usage.
  - `Auto-Healer`: One-click repair for common Klipper service issues.
- **Visual Configuration Editor**:
  - GUI for editing `printer.cfg` (Z-Offset, Pressure Advance, etc.).
  - "Unsaved Changes" protection.
- **Installer Enhancements**:
  - Automated Nginx deployment (`deploy_webui.sh`).
  - Service management via templates (`service_manager.sh`).
  - Preflight checks (`env_check.sh`).

### Changed
- Rebranded UI from "KATANA OFS" to "HORIZON".
- Integrated `deploy_webui.sh` into the main `install_ui.sh` flow.

### Fixed
- React build process optimized for production.
- TypeScript errors in UI components resolved.
