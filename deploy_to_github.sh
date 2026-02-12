#!/bin/bash
# deploy_to_github.sh - Simple Push Helper

echo ""
echo "========================================"
echo "  KATANA v2.0 - GitHub Upload Helper"
echo "========================================"
echo ""
echo "Dieses Skript hilft dir, den Code hochzuladen, ohne blinde Passworteingabe."
echo ""
echo "Schritt 1: Token kopieren"
echo "Gehe auf https://github.com/settings/tokens und kopiere deinen Token."
echo ""
read -p "Schritt 2: Füge deinen Token hier ein (Rechtsklick/Einfügen): " TEH_TOKEN

if [ -z "$TEH_TOKEN" ]; then
    echo "Fehler: Kein Token eingegeben!"
    exit 1
fi

echo ""
echo "Teste Verbindung..."

# Konfiguriere Remote mit Token
REMOTE_URL="https://Extrutex:${TEH_TOKEN}@github.com/Extrutex/KATANA-Klipper-Installer.git"

git remote set-url origin "$REMOTE_URL"

echo "Starte Upload (Force Push überschreibt v1.5)..."
echo "----------------------------------------"

if git push -u origin main --force; then
    echo ""
    echo ">>> ERFOLG! KATANA v2.0 ist online. <<<"
    echo "Du kannst dieses Skript jetzt löschen."
else
    echo ""
    echo ">>> FEHLER: Der Token wurde abgelehnt."
    echo "Bitte erstelle einen neuen Token (Classic) mit 'repo' Rechten."
fi
