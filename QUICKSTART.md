# Quick Start Guide

## Prerequisites Setup

### 1. Database Setup

First, you need to set up the MySQL database user. Run these commands in MySQL:

```bash
# Connect to MySQL as root
mysql -u root -p

# Then run the setup script
source setup-database.sql
```

Or run directly:
```bash
mysql -u root -p < setup-database.sql
```

### 2. Verify Environment Variables

Make sure your `.env` file exists with the correct credentials:
- Database connection details
- EmailIt API key
- JWT secret
- Admin email

### 3. Initialize Database Tables

After setting up the database user, initialize the tables:

```bash
npm run init-db
```

This creates:
- All required database tables
- Default admin user (username: `admin`, password: `admin123`)

**⚠️ IMPORTANT: Change the default admin password after first login!**

## Running the Application

### Development Mode

Start both frontend and backend servers:

```bash
npm run dev
```

This will start:
- Backend API server on `http://localhost:1221`
- Frontend dev server on `http://localhost:5173`

### Production Mode

1. Build the frontend:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

The server will serve both the API and built frontend on port 1221.

## First Time Setup Checklist

- [ ] MySQL server is running
- [ ] Database user created (`setup-database.sql`)
- [ ] `.env` file is configured
- [ ] Database tables initialized (`npm run init-db`)
- [ ] Dependencies installed (`npm install`)
- [ ] Development servers started (`npm run dev`)

## Testing the Application

### Test the Audit Form

1. Open `http://localhost:5173`
2. Fill out the 4-step audit form
3. Check your email for the audit report

### Test the Admin Dashboard

1. Click "Admin Login" in the header
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. View the admin dashboard with audit statistics

## Common Issues

### Database Connection Errors

If you see "Access denied" errors:
1. Verify MySQL is running
2. Check database credentials in `.env`
3. Ensure the database user was created correctly
4. Try connecting manually: `mysql -u audit -p audit`

### Port Already in Use

If port 1221 or 5173 is already in use:
1. Stop the conflicting process
2. Or change the port in `.env` (backend) or `vite.config.js` (frontend)

### Email Not Sending

If emails aren't being delivered:
1. Verify EmailIt API key in `.env`
2. Check console logs for error messages
3. Ensure the admin email is correct

### PDF Generation Fails

If PDF generation fails:
1. Check that `public/pdfs` directory exists
2. Verify write permissions on the directory
3. Check server logs for specific errors

## Next Steps

1. **Change Admin Password**: Login and change the default password
2. **Test Email Delivery**: Complete an audit to test email functionality
3. **Customize Branding**: Update logo and colors in the code
4. **Configure Domain**: Set up your production domain
5. **Enable SSL**: Configure HTTPS for production

## Support

For issues or questions:
- Check `README.md` for detailed documentation
- Review server logs for errors
- Contact: ryan@bowtiekreative.com
