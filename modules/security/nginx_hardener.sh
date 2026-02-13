#!/bin/bash
# modules/security/nginx_hardener.sh
# KATANA MODULE: NGINX HARKENING
# Upgrades standard Nginx config to Production Grade with WebSocket stability
# ==============================================================================

function run_nginx_hardener() {
    draw_header "NGINX HARDENER"
    echo "  This upgrades your Web Server configuration:"
    echo "  [+] Cloudflare/Proxy Real-IP support"
    echo "  [+] WebSocket Keep-Alive (Fixes disconnects)"
    echo "  [+] High Upload Limit (500MB+ GCodes)"
    echo "  [+] Gzip Compression (Faster UI)"
    echo ""
    
    # 1. Detection
    local active_conf=""
    
    if [ -L "/etc/nginx/sites-enabled/default" ]; then
        active_conf=$(readlink -f /etc/nginx/sites-enabled/default)
    else
        log_warn "No active site found in /etc/nginx/sites-enabled/default" 
        echo "  Looking for known configs..."
        if [ -f "/etc/nginx/sites-available/mainsail" ]; then
            active_conf="/etc/nginx/sites-available/mainsail"
        elif [ -f "/etc/nginx/sites-available/fluidd" ]; then
             active_conf="/etc/nginx/sites-available/fluidd"
        fi
    fi
    
    if [ -z "$active_conf" ]; then
        log_error "Could not detect active Nginx config for Klipper."
        echo "  [!] Please install a UI first."
        read -p "  Press Enter..."
        return
    fi
    
    echo "  Target Config: $active_conf"
    read -p "  Proceed with hardening? [y/N] " yn
    if [[ ! "$yn" =~ ^[yY] ]]; then return; fi
    
    # 2. Backup
    local timestamp=$(date +%Y%m%d_%H%M%S)
    local backup_file="${active_conf}.backup_${timestamp}"
    
    log_info "Creating backup: $backup_file"
    sudo cp "$active_conf" "$backup_file"
    
    # 3. Apply Hardened Config
    apply_hardened_config "$active_conf"
    
    # 4. Verify & Reload
    log_info "Verifying Nginx syntax..."
    if sudo nginx -t; then
        log_success "Syntax valid. Reloading Nginx..."
        sudo systemctl reload nginx
        log_success "Nginx Hardening Applied Successfully!"
    else
        log_error "Syntax check FAILED. Rolling back..."
        sudo cp "$backup_file" "$active_conf"
        sudo systemctl reload nginx
        log_warn "Rollback complete. Check standard output for errors."
    fi
    read -p "  Press Enter..."
}

function apply_hardened_config() {
    local target="$1"
    local ui_root=""
    
    # Extract root from existing config if possible, or guess based on filename
    if grep -q "root" "$target"; then
         # Try to extract existing root path to preserve it
         ui_root=$(grep "root" "$target" | head -n 1 | awk '{print $2}' | tr -d ';')
    fi
    
    # Fallback if detection fails
    if [[ "$target" == *"mainsail"* ]]; then
        [ -z "$ui_root" ] && ui_root="$HOME/mainsail"
    elif [[ "$target" == *"fluidd"* ]]; then
         [ -z "$ui_root" ] && ui_root="$HOME/fluidd"
    else
         [ -z "$ui_root" ] && ui_root="$HOME/mainsail" # Default fallback
    fi
    
    log_info "Applying Hardened Template (Root: $ui_root)..."
    
    cat <<EOF | sudo tee "$target" > /dev/null
# KATANA HARDENED CONFIG v1.0
server {
    listen 80 default_server;
    listen [::]:80 default_server;

    # SYTEM PERFORMANCE
    gzip on;
    gzip_vary on;
    gzip_proxied any;
    gzip_comp_level 6;
    gzip_types text/plain text/css text/xml application/json application/javascript application/rss+xml application/atom+xml image/svg+xml;

    # CLIENT LIMITS
    client_max_body_size 1024M;
    proxy_read_timeout 86400;  # 24h timeout prevents disconnects
    proxy_send_timeout 86400;

    access_log /var/log/nginx/klipper_access.log;
    error_log /var/log/nginx/klipper_error.log;

    # UI ROOT
    location / {
        root $ui_root;
        index index.html index.htm;
        try_files \$uri \$uri/ /index.html;
        # Cache control for static assets
        expires 1h; 
        add_header Cache-Control "public, no-transform";
    }

    # MOONRAKER API
    location /server {
        proxy_pass http://127.0.0.1:7125;
        proxy_set_header Host \$http_host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Scheme \$scheme;
    }

    # WEBSOCKET (CRITICAL FOR MAINSALI/FLUIDD)
    location /websocket {
        proxy_pass http://127.0.0.1:7125/websocket;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host \$http_host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_read_timeout 86400;
    }

    # WEBCAM (MJPEG STREAMER)
    location /webcam {
        proxy_pass http://127.0.0.1:8080/;
        proxy_http_version 1.1;
        proxy_set_header Host \$http_host;
        proxy_set_header X-Real-IP \$remote_addr;
    }
}
EOF
}
