# Cloudflare SSL Error 526 - Fix Guide

## Understanding Error 526

Error 526 means: **"Invalid SSL certificate"**
- Cloudflare can't validate the SSL certificate on your origin server
- Your origin server is using a self-signed or invalid certificate
- Or SSL is not properly configured on the origin

## Solution Options

### Option 1: Use Cloudflare Flexible SSL (Recommended for Quick Fix)

This is the fastest solution. Cloudflare handles SSL between visitor and Cloudflare, while using HTTP between Cloudflare and your server.

**Steps:**

1. **Login to Cloudflare Dashboard**
   - Go to https://dash.cloudflare.com
   - Select your domain (bowtiekreative.com)

2. **Change SSL/TLS Mode**
   - Click on "SSL/TLS" in the left sidebar
   - Click on "Overview"
   - Change encryption mode to **"Flexible"**
   - Wait 5-10 minutes for changes to propagate

3. **Update Nginx Configuration**
   
   Edit your Nginx config:
   ```bash
   sudo nano /etc/nginx/sites-available/audit.bowtiekreative.com
   ```

   Use this configuration:
   ```nginx
   server {
       listen 80;
       server_name audit.bowtiekreative.com;

       # Logging
       access_log /var/log/nginx/audit-access.log;
       error_log /var/log/nginx/audit-error.log;

       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;

       # Proxy to Node.js application
       location / {
           proxy_pass http://localhost:1221;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
           proxy_read_timeout 300s;
           proxy_connect_timeout 75s;
       }

       # Serve PDF files directly
       location /pdfs {
           alias /var/www/bowtiekreative-audit/public/pdfs;
           expires 1d;
           add_header Cache-Control "public, immutable";
       }

       # File upload size limit
       client_max_body_size 10M;
   }
   ```

   **Remove any HTTPS/443 configuration for now**

4. **Test and Restart Nginx**
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Test Your Site**
   - Visit https://audit.bowtiekreative.com
   - It should work now (Cloudflare handles HTTPS)

---

### Option 2: Use Cloudflare Origin Certificate (More Secure)

This provides encryption between Cloudflare and your server using a Cloudflare-issued certificate.

**Steps:**

1. **Generate Cloudflare Origin Certificate**
   
   - Login to Cloudflare Dashboard
   - Go to SSL/TLS → Origin Server
   - Click "Create Certificate"
   - Select:
     - Private key type: RSA (2048)
     - Hostnames: audit.bowtiekreative.com, *.bowtiekreative.com
     - Certificate Validity: 15 years
   - Click "Create"
   
2. **Save Certificate Files**
   
   Copy the certificate and private key shown:
   
   ```bash
   # Create directory for certificates
   sudo mkdir -p /etc/ssl/cloudflare
   
   # Save the Origin Certificate
   sudo nano /etc/ssl/cloudflare/audit.bowtiekreative.com.pem
   # Paste the Origin Certificate (including BEGIN and END lines)
   
   # Save the Private Key
   sudo nano /etc/ssl/cloudflare/audit.bowtiekreative.com.key
   # Paste the Private Key (including BEGIN and END lines)
   
   # Set proper permissions
   sudo chmod 644 /etc/ssl/cloudflare/audit.bowtiekreative.com.pem
   sudo chmod 600 /etc/ssl/cloudflare/audit.bowtiekreative.com.key
   ```

3. **Update Nginx Configuration**
   
   ```bash
   sudo nano /etc/nginx/sites-available/audit.bowtiekreative.com
   ```

   Use this configuration:
   ```nginx
   server {
       listen 80;
       server_name audit.bowtiekreative.com;
       return 301 https://$server_name$request_uri;
   }

   server {
       listen 443 ssl http2;
       server_name audit.bowtiekreative.com;

       # Cloudflare Origin Certificate
       ssl_certificate /etc/ssl/cloudflare/audit.bowtiekreative.com.pem;
       ssl_certificate_key /etc/ssl/cloudflare/audit.bowtiekreative.com.key;
       
       # SSL Configuration
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;
       ssl_prefer_server_ciphers on;

       # Logging
       access_log /var/log/nginx/audit-access.log;
       error_log /var/log/nginx/audit-error.log;

       # Security headers
       add_header X-Frame-Options "SAMEORIGIN" always;
       add_header X-Content-Type-Options "nosniff" always;
       add_header X-XSS-Protection "1; mode=block" always;
       add_header Strict-Transport-Security "max-age=31536000" always;

       # Proxy to Node.js application
       location / {
           proxy_pass http://localhost:1221;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto https;
           proxy_cache_bypass $http_upgrade;
           proxy_read_timeout 300s;
           proxy_connect_timeout 75s;
       }

       # Serve PDF files directly
       location /pdfs {
           alias /var/www/bowtiekreative-audit/public/pdfs;
           expires 1d;
           add_header Cache-Control "public, immutable";
       }

       # File upload size limit
       client_max_body_size 10M;
   }
   ```

4. **Set Cloudflare SSL Mode to Full**
   
   - Go to Cloudflare Dashboard → SSL/TLS → Overview
   - Set encryption mode to **"Full (strict)"** or **"Full"**

5. **Test and Restart Nginx**
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

---

### Option 3: Use Let's Encrypt (If NOT using Cloudflare proxy)

Only use this if you're **NOT** using Cloudflare's proxy (orange cloud OFF).

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get certificate
sudo certbot --nginx -d audit.bowtiekreative.com

# Cloudflare SSL Mode: Set to "Full (strict)"
```

---

## Recommended Setup for Cloudflare

### Step-by-Step Quick Fix

1. **Remove any existing SSL configuration**
   ```bash
   sudo nano /etc/nginx/sites-available/audit.bowtiekreative.com
   ```
   
   Replace with:
   ```nginx
   server {
       listen 80;
       server_name audit.bowtiekreative.com;

       access_log /var/log/nginx/audit-access.log;
       error_log /var/log/nginx/audit-error.log;

       location / {
           proxy_pass http://localhost:1221;
           proxy_http_version 1.1;
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }

       location /pdfs {
           alias /var/www/bowtiekreative-audit/public/pdfs;
       }
   }
   ```

2. **Restart Nginx**
   ```bash
   sudo nginx -t
   sudo systemctl restart nginx
   ```

3. **Set Cloudflare to Flexible SSL**
   - Cloudflare Dashboard → SSL/TLS → Overview
   - Select "Flexible"
   - Wait 5 minutes

4. **Test**
   - Visit https://audit.bowtiekreative.com
   - Should work now!

---

## Cloudflare SSL Modes Explained

| Mode | Visitor to CF | CF to Server | Certificate Needed |
|------|--------------|--------------|-------------------|
| **Off** | HTTP | HTTP | No |
| **Flexible** | HTTPS | HTTP | No (FASTEST FIX) |
| **Full** | HTTPS | HTTPS | Yes (self-signed OK) |
| **Full (strict)** | HTTPS | HTTPS | Yes (valid cert required) |

---

## Current Issue Diagnosis

Your server likely has:
- ❌ No SSL certificate installed
- ❌ OR self-signed certificate with Cloudflare in "Full (strict)" mode
- ❌ OR Let's Encrypt certificate that Cloudflare can't verify

---

## Troubleshooting Commands

### Check if Nginx is listening on port 443
```bash
sudo netstat -tlnp | grep :443
```

### Check Nginx configuration
```bash
sudo nginx -t
```

### View Nginx error logs
```bash
sudo tail -f /var/log/nginx/error.log
```

### Check if application is running
```bash
curl http://localhost:1221/api/health
```

### Test DNS resolution
```bash
dig audit.bowtiekreative.com
```

### Check Cloudflare IP
```bash
curl -I https://audit.bowtiekreative.com
```

---

## Immediate Fix (Do This Now)

**Run these commands in order:**

```bash
# 1. Backup current config
sudo cp /etc/nginx/sites-available/audit.bowtiekreative.com /etc/nginx/sites-available/audit.bowtiekreative.com.backup

# 2. Create new simple config
sudo tee /etc/nginx/sites-available/audit.bowtiekreative.com > /dev/null <<'EOF'
server {
    listen 80;
    server_name audit.bowtiekreative.com;

    location / {
        proxy_pass http://localhost:1221;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }

    location /pdfs {
        alias /var/www/bowtiekreative-audit/public/pdfs;
    }
}
EOF

# 3. Test and restart Nginx
sudo nginx -t && sudo systemctl restart nginx

# 4. Check if app is running
pm2 status

# 5. If app not running, start it
cd /var/www/bowtiekreative-audit && pm2 start server/index.js --name "audit-platform"
```

**Then in Cloudflare:**
1. Go to SSL/TLS → Overview
2. Select "Flexible"
3. Wait 5 minutes
4. Test: https://audit.bowtiekreative.com

---

## After Fix - Optional Security Enhancement

Once the site is working with Flexible SSL, you can enhance security:

1. Generate Cloudflare Origin Certificate (see Option 2 above)
2. Update Nginx to use it
3. Change Cloudflare SSL mode to "Full (strict)"

This gives you end-to-end encryption while keeping things simple.

---

## Need Help?

If the issue persists after trying the immediate fix:

1. Check that your app is running: `pm2 status`
2. Check Nginx is running: `sudo systemctl status nginx`
3. Check logs: `sudo tail -f /var/log/nginx/error.log`
4. Verify Cloudflare SSL mode is "Flexible"
5. Wait 5-10 minutes after changing Cloudflare settings

Contact: ryan@bowtiekreative.com
