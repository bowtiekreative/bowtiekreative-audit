# Manual Deployment Steps - READY TO DEPLOY

## ✅ Code Status

- **Branch:** `main` 
- **GitHub:** All code pushed and merged ✅
- **PR #1:** Merged successfully ✅
- **Commits:** All changes committed ✅

**GitHub Repository:** https://github.com/bowtiekreative/bowtiekreative-audit

---

## 🚀 Quick Deployment (Automated Script)

The easiest way to deploy is using the automated script:

### SSH to Production Server

```bash
ssh user@your-server-ip
# or
ssh user@audit.bowtiekreative.com
```

### Run the Deployment Script

```bash
cd /var/www/bowtiekreative-audit
git pull origin main
chmod +x deploy-to-production.sh
./deploy-to-production.sh
```

The script will:
1. ✅ Backup your database
2. ✅ Pull latest code from GitHub
3. ✅ Install dependencies
4. ✅ Run database migration
5. ✅ Restart the application
6. ✅ Verify deployment

**⚠️ You'll need your MySQL password handy!**

---

## 📋 Manual Deployment (Step-by-Step)

If you prefer to deploy manually, follow these steps:

### Step 1: SSH to Production Server

```bash
ssh user@your-server-ip
```

### Step 2: Navigate to Application Directory

```bash
cd /var/www/bowtiekreative-audit
```

### Step 3: Backup Database (IMPORTANT!)

```bash
# Create backup directory if it doesn't exist
sudo mkdir -p /var/backups/mysql

# Backup the database
mysqldump -u audit -p audit > /var/backups/mysql/audit_backup_$(date +%Y%m%d_%H%M%S).sql

# Verify backup was created
ls -lh /var/backups/mysql/
```

### Step 4: Pull Latest Code

```bash
# Fetch latest changes
git fetch origin

# Checkout main branch
git checkout main

# Pull latest code
git pull origin main
```

You should see output indicating these new files:
- `DEPLOYMENT_STATUS.md`
- `UPDATE_CODE_FEATURE.md`
- `server/config/add-update-code-migration.sql`
- `server/middleware/rateLimiter.js`
- `deploy-to-production.sh`
- Plus changes to existing files

### Step 5: Install New Dependencies

```bash
npm install --production
```

This will install the new `express-rate-limit` package.

### Step 6: Run Database Migration

**⚠️ CRITICAL STEP - Do not skip this!**

```bash
mysql -u audit -p audit < server/config/add-update-code-migration.sql
```

Enter your database password when prompted.

#### Verify Migration Succeeded

```bash
mysql -u audit -p audit -e "SHOW COLUMNS FROM audits LIKE 'update_code';"
```

You should see output showing the `update_code` column.

#### Check for Errors

```bash
mysql -u audit -p audit -e "SELECT COUNT(*) as total, COUNT(update_code) as with_codes FROM audits;"
```

Both numbers should be equal (all audits should have update codes).

### Step 7: Build Frontend (if applicable)

```bash
# Only if you're serving built files
npm run build
```

### Step 8: Restart Application

```bash
# Using PM2 (most likely)
pm2 restart audit-platform

# Verify it's running
pm2 status

# Check logs for errors
pm2 logs audit-platform --lines 50
```

**Alternative restart methods** (if PM2 isn't working):

```bash
# If using systemd
sudo systemctl restart your-app-service

# If using a different process manager
# Stop and start your application using your normal method
```

### Step 9: Verify Deployment

#### Test New API Endpoint

```bash
curl -X POST https://audit.bowtiekreative.com/api/audits/verify-code \
  -H "Content-Type: application/json" \
  -d '{"updateCode":"1234","email":"test@example.com"}'
```

**Expected Result:** Should return JSON (not HTML 404 error)
- `{"success":false,"message":"Invalid update code or email..."}` = ✅ Working
- `Cannot POST /api/audits/verify-code` = ❌ Not deployed yet

#### Test Rate Limiting

```bash
# Run this 6 times quickly
for i in {1..6}; do
  curl -s -X POST https://audit.bowtiekreative.com/api/audits/verify-code \
    -H "Content-Type: application/json" \
    -d '{"updateCode":"1234","email":"test@example.com"}' | head -1
  echo ""
done
```

**Expected:** 6th request should return `429` (rate limited)

#### Create Test Audit

```bash
curl -X POST https://audit.bowtiekreative.com/api/audits \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "Test Business",
    "contact_name": "John Doe",
    "email": "your-email@example.com",
    "phone": "555-1234",
    "has_website": true,
    "has_social_media": false
  }'
```

**Expected:** Response should include `"updateCode":"XXXX"` field

#### Check Email

Check the email inbox for `your-email@example.com`:
- ✅ Email should contain a prominent 4-digit code
- ✅ Email should have "Update Your Audit" button/link
- ✅ Link format: `https://audit.bowtiekreative.com/update-audit?code=XXXX&email=...`

### Step 10: Monitor Logs

```bash
# Watch application logs
pm2 logs audit-platform

# Check for errors
pm2 logs audit-platform --err

# View recent logs
pm2 logs audit-platform --lines 100 --nostream
```

Look for:
- ✅ No errors on startup
- ✅ Database connection successful
- ✅ Server listening on port 1221
- ❌ Any rate limit errors (shouldn't be any unless being abused)

---

## 🐛 Troubleshooting

### Issue: "Cannot POST /api/audits/verify-code"

**Cause:** Application hasn't been restarted or code wasn't pulled

**Solution:**
```bash
cd /var/www/bowtiekreative-audit
git pull origin main
pm2 restart audit-platform
pm2 logs audit-platform
```

### Issue: "Column 'update_code' cannot be null"

**Cause:** Database migration wasn't run

**Solution:**
```bash
cd /var/www/bowtiekreative-audit
mysql -u audit -p audit < server/config/add-update-code-migration.sql
pm2 restart audit-platform
```

### Issue: "Cannot find module 'express-rate-limit'"

**Cause:** Dependencies weren't installed

**Solution:**
```bash
cd /var/www/bowtiekreative-audit
npm install --production
pm2 restart audit-platform
```

### Issue: Application won't start

**Solution:**
```bash
# Check PM2 logs
pm2 logs audit-platform --err

# Check if port is already in use
sudo netstat -tulpn | grep 1221

# Try deleting and restarting PM2
pm2 delete audit-platform
pm2 start server/index.js --name audit-platform
pm2 save
```

### Issue: Rate limiting not working

**Cause:** Middleware not properly loaded

**Check:**
```bash
cd /var/www/bowtiekreative-audit
grep -n "rateLimiter" server/routes/auditRoutes.js
```

Should show imports and usage of rate limiters.

### Issue: Database connection failed

**Solution:**
```bash
# Test database connection
mysql -u audit -p audit

# If it fails, check MySQL is running
sudo systemctl status mysql

# Restart MySQL if needed
sudo systemctl restart mysql
```

---

## 📊 Post-Deployment Checklist

After deployment, verify:

- [ ] Application is running (`pm2 status`)
- [ ] No errors in logs (`pm2 logs audit-platform`)
- [ ] New endpoint responds (not 404)
- [ ] Rate limiting works (429 after threshold)
- [ ] Database has update_code column
- [ ] Existing audits have update codes
- [ ] New audits generate update codes
- [ ] Emails contain update code
- [ ] Update link in email works
- [ ] Can verify and update audits
- [ ] PDF regenerates on update

---

## 📞 Need Help?

If deployment fails or you encounter issues:

1. **Check the logs first:**
   ```bash
   pm2 logs audit-platform --lines 200
   ```

2. **Verify all steps were completed:**
   - Database migration ran successfully
   - Dependencies installed
   - Application restarted

3. **Roll back if needed:**
   ```bash
   # Restore database backup
   mysql -u audit -p audit < /var/backups/mysql/audit_backup_TIMESTAMP.sql
   
   # Checkout previous version
   git checkout <previous-commit-hash>
   pm2 restart audit-platform
   ```

4. **Contact support:**
   - Email: ryan@bowtiekreative.com
   - Include: Error messages, logs, steps you've tried

---

## 📝 Summary

**What This Deployment Adds:**

1. **4-Digit Update Code Feature**
   - Users receive unique code via email
   - Can return and modify their audit
   - Secure verification (code + email required)

2. **Rate Limiting Security**
   - 5 verification attempts per 15 minutes
   - 3 updates per hour
   - 3 audit creations per hour
   - Prevents brute force and spam

3. **Email Updates**
   - Prominent display of update code
   - Direct "Update Your Audit" link
   - Update confirmation emails

4. **New API Endpoints**
   - `POST /api/audits/verify-code` - Verify code
   - `PUT /api/audits/update` - Update audit

---

## ✅ Deployment Complete!

Once all steps are done and tests pass, the update code feature is live on production!

**GitHub Repo:** https://github.com/bowtiekreative/bowtiekreative-audit  
**Branch:** main  
**Latest Commit:** Includes all update code features

**Documentation:**
- `UPDATE_CODE_FEATURE.md` - Feature documentation
- `DEPLOYMENT_STATUS.md` - Deployment guide
- `deploy-to-production.sh` - Automated deployment script
