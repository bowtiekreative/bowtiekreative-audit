# Deployment Guide

## Production Deployment on audit.bowtiekreative.com

### Server Requirements

- Ubuntu/Debian server or similar
- Node.js v18+ installed
- MySQL 8.0+ installed
- Nginx (recommended for reverse proxy)
- SSL certificate (Let's Encrypt recommended)
- Domain pointed to server IP

### Step 1: Server Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js (if not installed)
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install MySQL (if not installed)
sudo apt install -y mysql-server

# Install Nginx (if not installed)
sudo apt install -y nginx

# Install PM2 for process management
sudo npm install -g pm2
```

### Step 2: Database Setup

```bash
# Secure MySQL installation
sudo mysql_secure_installation

# Create database and user
sudo mysql -u root -p < setup-database.sql

# Or manually:
sudo mysql -u root -p
```

Then in MySQL:
```sql
CREATE DATABASE audit;
CREATE USER 'audit'@'localhost' IDENTIFIED BY '5878892404@Deerfoot';
GRANT ALL PRIVILEGES ON audit.* TO 'audit'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Step 3: Application Setup

```bash
# Clone repository or upload files
cd /var/www
sudo mkdir -p bowtiekreative-audit
sudo chown $USER:$USER bowtiekreative-audit
cd bowtiekreative-audit

# Copy your application files here

# Install dependencies
npm install --production

# Create production .env file
nano .env
```

Update `.env` for production:
```env
PORT=1221
NODE_ENV=production

DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=audit
DB_PASSWORD=5878892404@Deerfoot
DB_NAME=audit

EMAILIT_API_KEY=em_VVSoFttG3MRlnKZG2JHE3bI0NnV2kCJm
EMAILIT_API_URL=https://api.emailit.com/v1
ADMIN_EMAIL=ryan@bowtiekreative.com

JWT_SECRET=<generate-strong-random-secret>
APP_URL=https://audit.bowtiekreative.com
```

```bash
# Initialize database
npm run init-db

# Build frontend
npm run build

# Set up directories
mkdir -p public/pdfs public/uploads
chmod 755 public/pdfs public/uploads
```

### Step 4: Nginx Configuration

Create Nginx config:
```bash
sudo nano /etc/nginx/sites-available/audit.bowtiekreative.com
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name audit.bowtiekreative.com;

    # Redirect HTTP to HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name audit.bowtiekreative.com;

    # SSL Configuration (update paths after getting certificate)
    ssl_certificate /etc/letsencrypt/live/audit.bowtiekreative.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/audit.bowtiekreative.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

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

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/audit.bowtiekreative.com /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### Step 5: SSL Certificate (Let's Encrypt)

```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d audit.bowtiekreative.com

# Certbot will automatically update your Nginx config
# Follow the prompts and choose to redirect HTTP to HTTPS

# Test automatic renewal
sudo certbot renew --dry-run
```

### Step 6: Start Application with PM2

```bash
cd /var/www/bowtiekreative-audit

# Start the application
pm2 start server/index.js --name "audit-platform"

# Save PM2 configuration
pm2 save

# Set up PM2 to start on system boot
pm2 startup
# Follow the command output to complete setup

# Monitor logs
pm2 logs audit-platform

# Check status
pm2 status
```

### Step 7: Firewall Configuration

```bash
# Allow SSH, HTTP, and HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status
```

### Step 8: Set Up Database Backups

Create a backup script:
```bash
sudo nano /usr/local/bin/backup-audit-db.sh
```

Add:
```bash
#!/bin/bash
BACKUP_DIR="/var/backups/mysql"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

mysqldump -u audit -p'5878892404@Deerfoot' audit > $BACKUP_DIR/audit_$DATE.sql

# Keep only last 7 days of backups
find $BACKUP_DIR -name "audit_*.sql" -mtime +7 -delete
```

Make it executable and add to cron:
```bash
sudo chmod +x /usr/local/bin/backup-audit-db.sh
sudo crontab -e
```

Add this line for daily backups at 2 AM:
```
0 2 * * * /usr/local/bin/backup-audit-db.sh
```

### Step 9: Monitoring and Maintenance

```bash
# View application logs
pm2 logs audit-platform

# Monitor system resources
pm2 monit

# Restart application
pm2 restart audit-platform

# View Nginx logs
sudo tail -f /var/log/nginx/audit-access.log
sudo tail -f /var/log/nginx/audit-error.log

# Check MySQL status
sudo systemctl status mysql

# Check disk space
df -h
```

### Step 10: Post-Deployment Checklist

- [ ] Application is running on PM2
- [ ] Nginx is serving the application
- [ ] SSL certificate is installed and working
- [ ] Database is accessible and initialized
- [ ] Default admin password has been changed
- [ ] Test audit form submission
- [ ] Test email delivery (EmailIt)
- [ ] Test PDF generation
- [ ] Test admin dashboard access
- [ ] Database backups are configured
- [ ] Firewall is configured
- [ ] Monitoring is set up
- [ ] Domain DNS is correctly configured

### Updating the Application

```bash
cd /var/www/bowtiekreative-audit

# Pull latest changes (if using git)
git pull

# Install dependencies
npm install --production

# Build frontend
npm run build

# Restart application
pm2 restart audit-platform

# Check logs
pm2 logs audit-platform --lines 50
```

### Troubleshooting

#### Application Won't Start

```bash
# Check PM2 logs
pm2 logs audit-platform

# Check if port is in use
sudo netstat -tulpn | grep 1221

# Restart PM2
pm2 restart audit-platform

# If all else fails, delete and restart
pm2 delete audit-platform
pm2 start server/index.js --name "audit-platform"
```

#### Database Connection Issues

```bash
# Test database connection
mysql -u audit -p'5878892404@Deerfoot' audit

# Check MySQL is running
sudo systemctl status mysql

# Restart MySQL
sudo systemctl restart mysql
```

#### Nginx Issues

```bash
# Test Nginx configuration
sudo nginx -t

# Check Nginx status
sudo systemctl status nginx

# Restart Nginx
sudo systemctl restart nginx

# Check Nginx logs
sudo tail -f /var/log/nginx/error.log
```

#### SSL Certificate Issues

```bash
# Check certificate status
sudo certbot certificates

# Renew certificates
sudo certbot renew

# If renewal fails, try
sudo certbot renew --force-renewal
```

### Security Best Practices

1. **Change default admin password immediately**
2. **Use strong JWT secret** (generate with: `openssl rand -base64 32`)
3. **Keep system updated**: `sudo apt update && sudo apt upgrade`
4. **Monitor logs regularly** for suspicious activity
5. **Set up fail2ban** to prevent brute force attacks
6. **Use environment variables** for all secrets
7. **Regularly backup database**
8. **Keep SSL certificates up to date**
9. **Use strong database password**
10. **Limit SSH access** (consider key-based authentication only)

### Maintenance Schedule

- **Daily**: Check application logs
- **Weekly**: Review audit submissions, check disk space
- **Monthly**: Review security updates, test backups
- **Quarterly**: Review and update dependencies

### Support

For deployment issues:
- Check logs first (PM2, Nginx, MySQL)
- Review this guide thoroughly
- Contact: ryan@bowtiekreative.com
