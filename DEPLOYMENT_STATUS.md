# Deployment Status - Update Code Feature

## 🔴 Current Status: NOT DEPLOYED TO PRODUCTION

### Verification Results

**Production URL:** https://audit.bowtiekreative.com/  
**Production API Test:** ❌ New endpoints do not exist  
**Test Endpoint:** `POST /api/audits/verify-code` returns 404

### What This Means

The changes we made are **ONLY in your local development environment**. They have been:
- ✅ Implemented and tested locally
- ✅ Committed to git (feature branch)
- ❌ NOT pushed to GitHub
- ❌ NOT deployed to production server

---

## 📦 What Was Implemented (Locally)

### Commits on Branch: `feature/audit-update-code`

1. **Commit 1ab7eb6:** Rate limiting to prevent brute force attacks
2. **Commit 3090a83:** 4-digit update code for audit modifications

### Files Changed (9 files, 733 lines)
```
✅ UPDATE_CODE_FEATURE.md (new documentation)
✅ server/config/add-update-code-migration.sql (DB migration)
✅ server/config/schema.sql (added update_code column)
✅ server/controllers/auditController.js (+109 lines)
✅ server/middleware/rateLimiter.js (new security middleware)
✅ server/models/Audit.js (+119 lines)
✅ server/routes/auditRoutes.js (new routes + rate limiting)
✅ server/utils/emailService.js (+63 lines)
✅ package.json (added express-rate-limit)
```

---

## 🚀 Steps to Deploy to Production

### Option 1: Manual Deployment to Production Server

If you have SSH access to your production server at audit.bowtiekreative.com:

```bash
# 1. SSH into production server
ssh user@audit.bowtiekreative.com

# 2. Navigate to application directory
cd /path/to/webapp

# 3. Pull latest changes (after pushing to GitHub)
git fetch origin
git checkout feature/audit-update-code
# OR merge to main first:
# git checkout main
# git merge feature/audit-update-code

# 4. Install new dependencies
npm install

# 5. Run database migration
mysql -u audit -p audit < server/config/add-update-code-migration.sql

# 6. Restart the application
pm2 restart all
# OR
systemctl restart your-app-service
# OR
npm run start
```

### Option 2: Push to GitHub First

```bash
# From your local machine or this sandbox:
cd /home/bowtiekreative-audit/webapp

# Push the feature branch to GitHub
git push -u origin feature/audit-update-code

# Then create a Pull Request on GitHub:
# https://github.com/bowtiekreative/bowtiekreative-audit/compare/main...feature/audit-update-code

# After PR is approved and merged to main, deploy from main branch
```

### Option 3: Deploy from This Sandbox

If you want to deploy directly from this sandbox environment:

```bash
# 1. Ensure we're on the feature branch
cd /home/bowtiekreative-audit/webapp
git checkout feature/audit-update-code

# 2. Set up GitHub authentication (if not already done)
# You'll need a GitHub Personal Access Token

# 3. Push to GitHub
git push -u origin feature/audit-update-code

# 4. Then SSH to production and pull changes
```

---

## 🔧 Required Configuration on Production

### 1. Database Migration

**CRITICAL:** You must run the migration before starting the updated application:

```bash
mysql -u audit -p audit < server/config/add-update-code-migration.sql
```

This will:
- Add the `update_code` column to the `audits` table
- Generate unique 4-digit codes for existing audits
- Set proper constraints

### 2. NPM Dependencies

Install the new `express-rate-limit` package:

```bash
npm install
```

### 3. Environment Variables

No new environment variables are required. Existing `.env` file is sufficient.

### 4. Application Restart

After deploying code and migrating database:

```bash
# If using PM2
pm2 restart all
pm2 logs

# If using systemd
sudo systemctl restart your-app-service
sudo systemctl status your-app-service

# If using other process manager
# Stop and start your application
```

---

## ✅ Post-Deployment Testing

After deploying, test these endpoints:

### 1. Test New Verify Code Endpoint
```bash
curl -X POST https://audit.bowtiekreative.com/api/audits/verify-code \
  -H "Content-Type: application/json" \
  -d '{"updateCode":"1234","email":"test@example.com"}'

# Expected: 404 (Invalid code) or successful verification
```

### 2. Test Rate Limiting
```bash
# Run this 6 times quickly:
for i in {1..6}; do
  curl -X POST https://audit.bowtiekreative.com/api/audits/verify-code \
    -H "Content-Type: application/json" \
    -d '{"updateCode":"1234","email":"test@example.com"}'
  echo ""
done

# Expected: 6th request should return 429 (Too Many Requests)
```

### 3. Create Test Audit
```bash
curl -X POST https://audit.bowtiekreative.com/api/audits \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "Test Business",
    "contact_name": "John Doe",
    "email": "test@example.com",
    "has_website": true
  }'

# Expected: Response includes "updateCode" field
```

### 4. Check Email
After creating a test audit, check that the email:
- Contains a 4-digit update code
- Has an "Update Your Audit" button/link
- Link format: https://audit.bowtiekreative.com/update-audit?code=XXXX&email=...

---

## 🔍 Troubleshooting Production Deployment

### Issue: Migration Fails

**Error:** `Column 'update_code' cannot be null`

**Solution:** The migration script should handle this, but if it fails:
```sql
-- Temporarily allow NULL
ALTER TABLE audits ADD COLUMN update_code VARCHAR(4) UNIQUE;

-- Run the code generation procedure manually
-- (See add-update-code-migration.sql)

-- Then set NOT NULL
ALTER TABLE audits MODIFY COLUMN update_code VARCHAR(4) UNIQUE NOT NULL;
```

### Issue: Module Not Found - express-rate-limit

**Solution:**
```bash
npm install express-rate-limit
# Then restart application
```

### Issue: Endpoints Return 404

**Possible causes:**
1. Application not restarted after deployment
2. Wrong branch deployed (still on old main)
3. Build step needed (if using compiled code)

**Solution:**
```bash
# Check which branch is active
git branch --show-current

# Check if code has the new routes
grep -n "verify-code" server/routes/auditRoutes.js

# Restart application
pm2 restart all
```

### Issue: Rate Limiting Not Working

**Check logs:**
```bash
pm2 logs
# Look for: "Rate limit exceeded for IP: ..."
```

**Verify middleware is loaded:**
```bash
grep -n "rateLimiter" server/routes/auditRoutes.js
```

---

## 📊 Current State Summary

| Component | Local Dev | GitHub | Production |
|-----------|-----------|--------|------------|
| Update Code Feature | ✅ Done | ❌ Not Pushed | ❌ Not Deployed |
| Rate Limiting | ✅ Done | ❌ Not Pushed | ❌ Not Deployed |
| Database Schema | ✅ Updated | ❌ Not Pushed | ❌ Not Migrated |
| Documentation | ✅ Created | ❌ Not Pushed | ❌ N/A |
| Tests | ✅ Validated | ❌ Not Pushed | ❌ Not Run |

---

## 🎯 Next Action Required

**YOU MUST DO ONE OF THE FOLLOWING:**

### Quick Option (Recommended):
1. Get GitHub credentials working in this sandbox
2. Run: `git push -u origin feature/audit-update-code`
3. Create PR on GitHub
4. Merge to main
5. Deploy to production from main branch

### Alternative Option:
1. Copy these files to your local machine
2. Commit and push from your local machine
3. SSH to production and pull changes
4. Run migration and restart

### Direct Deploy Option:
1. SSH to production server
2. Manually copy changed files
3. Run migration
4. Install dependencies
5. Restart application

---

## 📝 Files to Deploy

If doing manual file copy, you need to transfer these files:

```
server/config/add-update-code-migration.sql (NEW - run this first!)
server/config/schema.sql (MODIFIED)
server/controllers/auditController.js (MODIFIED)
server/middleware/rateLimiter.js (NEW)
server/models/Audit.js (MODIFIED)
server/routes/auditRoutes.js (MODIFIED)
server/utils/emailService.js (MODIFIED)
package.json (MODIFIED - then run npm install)
UPDATE_CODE_FEATURE.md (NEW - documentation)
```

---

## ⚠️ Important Notes

1. **BACKUP DATABASE FIRST** before running migration
2. **TEST ON STAGING** if you have a staging environment
3. **MONITOR LOGS** after deployment for any errors
4. **VERIFY EMAILS** work with the new update code format
5. **TEST RATE LIMITING** to ensure it works correctly

---

## 📞 Need Help?

If deployment fails, check:
1. Application logs: `pm2 logs` or `journalctl -u your-service`
2. Database connection: Ensure migration completed successfully
3. Dependencies: Run `npm install` and restart
4. File permissions: Ensure new files are readable by the app user

---

Generated: 2024-11-11  
Feature Branch: `feature/audit-update-code`  
Commits: 2 (1ab7eb6, 3090a83)  
Status: **READY FOR DEPLOYMENT** ✅
