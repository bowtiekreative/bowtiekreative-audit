#!/bin/bash
###############################################################################
# Production Deployment Script for Update Code Feature
# audit.bowtiekreative.com
#
# This script must be run ON THE PRODUCTION SERVER via SSH
###############################################################################

set -e  # Exit on any error

echo "========================================="
echo "  Deploying Update Code Feature"
echo "  to audit.bowtiekreative.com"
echo "========================================="
echo ""

# Configuration
APP_DIR="/var/www/bowtiekreative-audit"
BACKUP_DIR="/var/backups/mysql"
DB_USER="audit"
DB_NAME="audit"
PM2_APP_NAME="audit-platform"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if running as root or with sudo
if [ "$EUID" -eq 0 ]; then 
    print_warning "Please don't run this script as root. Use a regular user with sudo access."
    exit 1
fi

echo "Step 1: Backup Database"
echo "------------------------"
read -p "Do you want to backup the database first? (yes/no): " backup_choice
if [ "$backup_choice" = "yes" ]; then
    sudo mkdir -p "$BACKUP_DIR"
    BACKUP_FILE="$BACKUP_DIR/audit_pre_update_code_$(date +%Y%m%d_%H%M%S).sql"
    
    read -sp "Enter MySQL password for user '$DB_USER': " db_password
    echo ""
    
    mysqldump -u "$DB_USER" -p"$db_password" "$DB_NAME" > "$BACKUP_FILE"
    
    if [ $? -eq 0 ]; then
        print_status "Database backed up to: $BACKUP_FILE"
    else
        print_error "Database backup failed!"
        exit 1
    fi
else
    print_warning "Skipping database backup (NOT RECOMMENDED)"
fi

echo ""
echo "Step 2: Navigate to Application Directory"
echo "----------------------------------------"
cd "$APP_DIR" || {
    print_error "Application directory not found: $APP_DIR"
    exit 1
}
print_status "In directory: $(pwd)"

echo ""
echo "Step 3: Fetch Latest Code from GitHub"
echo "-------------------------------------"
git fetch origin
print_status "Fetched latest code"

echo ""
echo "Step 4: Checkout Main Branch"
echo "----------------------------"
git checkout main
git pull origin main
print_status "Pulled latest main branch"

echo ""
echo "Step 5: Install New Dependencies"
echo "--------------------------------"
npm install --production
print_status "Dependencies installed"

echo ""
echo "Step 6: Run Database Migration"
echo "------------------------------"
print_warning "This will add the update_code column to the audits table"
read -p "Continue with database migration? (yes/no): " migrate_choice
if [ "$migrate_choice" = "yes" ]; then
    read -sp "Enter MySQL password for user '$DB_USER': " db_password
    echo ""
    
    mysql -u "$DB_USER" -p"$db_password" "$DB_NAME" < server/config/add-update-code-migration.sql
    
    if [ $? -eq 0 ]; then
        print_status "Database migration completed successfully"
        
        # Verify migration
        echo ""
        echo "Verifying migration..."
        mysql -u "$DB_USER" -p"$db_password" "$DB_NAME" -e "SHOW COLUMNS FROM audits LIKE 'update_code';"
        
        if [ $? -eq 0 ]; then
            print_status "Migration verified: update_code column exists"
        else
            print_warning "Could not verify migration"
        fi
    else
        print_error "Database migration failed!"
        echo ""
        print_warning "You may need to run the migration manually:"
        echo "  mysql -u $DB_USER -p $DB_NAME < server/config/add-update-code-migration.sql"
        exit 1
    fi
else
    print_error "Migration cancelled. Application may not work properly without this!"
    exit 1
fi

echo ""
echo "Step 7: Build Frontend (if needed)"
echo "---------------------------------"
if [ -f "package.json" ] && grep -q "\"build\"" package.json; then
    npm run build
    print_status "Frontend built successfully"
else
    print_warning "No build script found, skipping"
fi

echo ""
echo "Step 8: Restart Application"
echo "---------------------------"
pm2 restart "$PM2_APP_NAME"

if [ $? -eq 0 ]; then
    print_status "Application restarted successfully"
else
    print_error "Failed to restart application with PM2"
    print_warning "Trying alternative restart method..."
    pm2 delete "$PM2_APP_NAME" 2>/dev/null || true
    pm2 start server/index.js --name "$PM2_APP_NAME"
fi

echo ""
echo "Step 9: Save PM2 Configuration"
echo "------------------------------"
pm2 save
print_status "PM2 configuration saved"

echo ""
echo "Step 10: Check Application Status"
echo "---------------------------------"
pm2 list
echo ""
pm2 logs "$PM2_APP_NAME" --lines 20 --nostream

echo ""
echo "========================================="
echo "  Deployment Complete!"
echo "========================================="
echo ""
print_status "The update code feature has been deployed"
echo ""
echo "Next steps:"
echo "  1. Test the API endpoints:"
echo "     curl -X POST https://audit.bowtiekreative.com/api/audits/verify-code \\"
echo "       -H 'Content-Type: application/json' \\"
echo "       -d '{\"updateCode\":\"1234\",\"email\":\"test@test.com\"}'"
echo ""
echo "  2. Create a test audit and check for update code in email"
echo ""
echo "  3. Monitor logs:"
echo "     pm2 logs $PM2_APP_NAME"
echo ""
echo "  4. Check application status:"
echo "     pm2 status"
echo ""
echo "Documentation:"
echo "  - UPDATE_CODE_FEATURE.md - Feature documentation"
echo "  - DEPLOYMENT_STATUS.md - Deployment guide"
echo ""
print_status "Deployment script completed successfully!"
