# Source Nginx Hardener
if [ -f "$MODULES_DIR/security/nginx_hardener.sh" ]; then
    source "$MODULES_DIR/security/nginx_hardener.sh"
fi

function run_security_menu() {
    while true; do
        draw_header "SECURITY & BACKUP VAULT"
        echo "  Protect your system and data."
        echo ""
        echo "  1) System Hardening (Firewall & Log2Ram)"
        echo "  2) Create Backup (The Vault)"
        echo "  3) Restore Backup (The Vault)"
        echo "  4) Nginx Hardening (Fix Disconnects)"
        echo "  B) Back to Main Menu"
        
        read -p "  >> SELECT OPTION: " ch
        case $ch in
            1) run_hardening_wizard ;; # Defined in security/hardening.sh
            2) vault_create ;;        # Defined in security/vault.sh
            3) vault_restore ;;       # Defined in security/vault.sh
            4) 
                if type run_nginx_hardener &>/dev/null; then
                    run_nginx_hardener
                else
                    log_error "Nginx Hardener module missing."
                fi
                ;;
            [bB]) return ;;
            *) log_error "Invalid Selection." ;;
        esac
    done
}

