# Bowtie Kreative Digital Audit Platform

A comprehensive digital marketing audit platform that helps businesses analyze their online presence and receive personalized recommendations.

## Features

- 🎯 **Multi-Step Audit Form**: User-friendly, headless UI-based form with 4 comprehensive steps
- 📊 **Automated Scoring**: Intelligent scoring algorithm for website, social media, marketing, and automation
- 📄 **PDF Report Generation**: Beautiful, branded PDF reports with detailed analysis
- 📧 **Email Notifications**: Automated email delivery using EmailIt API
- 👥 **Admin Dashboard**: Secure admin panel to view all audits and statistics
- 🔐 **Authentication**: JWT-based admin authentication
- 💾 **Database Storage**: MySQL database for persistent storage
- 📱 **Responsive Design**: Mobile-friendly interface using Tailwind CSS
- ⚡ **Modern Stack**: React, Express, Node.js, and Vite

## Technology Stack

### Frontend
- React 19
- Tailwind CSS 4
- Headless UI
- Framer Motion (animations)
- React Hook Form
- Axios

### Backend
- Node.js
- Express 5
- MySQL 2
- PDFKit (PDF generation)
- JWT (authentication)
- BCrypt (password hashing)
- EmailIt API (email delivery)

## Prerequisites

- Node.js (v18 or higher)
- MySQL Server (v8 or higher)
- npm or yarn

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd webapp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   
   Copy `.env` and update with your credentials:
   ```env
   # Server Configuration
   PORT=1221
   NODE_ENV=development

   # Database Configuration
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_USER=audit
   DB_PASSWORD=5878892404@Deerfoot
   DB_NAME=audit

   # EmailIt API Configuration
   EMAILIT_API_KEY=em_VVSoFttG3MRlnKZG2JHE3bI0NnV2kCJm
   EMAILIT_API_URL=https://api.emailit.com/v1
   ADMIN_EMAIL=ryan@bowtiekreative.com

   # JWT Secret
   JWT_SECRET=your-secret-key-change-this-in-production

   # Application URL
   APP_URL=https://audit.bowtiekreative.com
   ```

4. **Initialize the database**
   ```bash
   npm run init-db
   ```
   
   This will create all necessary tables and a default admin user:
   - Username: `admin`
   - Password: `admin123`
   - **⚠️ Change this password immediately after first login!**

5. **Start the development servers**
   ```bash
   npm run dev
   ```
   
   This starts both the backend (port 1221) and frontend (port 5173) servers concurrently.

## Usage

### For End Users

1. Navigate to `http://localhost:5173` (development) or `https://audit.bowtiekreative.com` (production)
2. Complete the 4-step audit form:
   - **Step 1**: Business Information
   - **Step 2**: Digital Presence
   - **Step 3**: Marketing Goals
   - **Step 4**: Current Capabilities
3. Receive your audit report via email
4. Optionally book a strategy call for $250

### For Administrators

1. Click "Admin Login" in the header
2. Use your admin credentials
3. View dashboard with:
   - Total audits statistics
   - Recent audits list
   - Detailed audit information
   - Download PDF reports

## API Endpoints

### Public Endpoints

- `POST /api/audits` - Create a new audit
- `GET /api/audits/:auditId` - Get audit by ID
- `GET /api/audits/email/:email` - Get audits by email
- `POST /api/audits/:auditId/report` - Generate PDF report

### Admin Endpoints (Requires Authentication)

- `POST /api/auth/login` - Admin login
- `POST /api/auth/register` - Register new admin
- `GET /api/auth/verify` - Verify JWT token
- `GET /api/audits/admin/all` - Get all audits
- `GET /api/audits/admin/stats` - Get audit statistics

## Project Structure

```
webapp/
├── client/                 # Frontend React application
│   ├── public/            # Static assets
│   └── src/
│       ├── components/    # Reusable components
│       │   ├── steps/    # Form step components
│       │   ├── Header.jsx
│       │   ├── Footer.jsx
│       │   └── ...
│       ├── pages/        # Page components
│       │   ├── AuditForm.jsx
│       │   ├── AdminDashboard.jsx
│       │   ├── PrivacyPolicy.jsx
│       │   └── TermsConditions.jsx
│       ├── App.jsx       # Main app component
│       └── main.jsx      # Entry point
├── server/               # Backend Express application
│   ├── config/          # Database and configuration
│   ├── controllers/     # Route controllers
│   ├── models/          # Database models
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── index.js         # Server entry point
├── public/              # Generated files
│   ├── pdfs/           # Generated PDF reports
│   └── uploads/        # Uploaded files
└── package.json        # Dependencies and scripts
```

## Building for Production

1. **Build the frontend**
   ```bash
   npm run build
   ```

2. **Set environment to production**
   ```env
   NODE_ENV=production
   ```

3. **Start the production server**
   ```bash
   npm start
   ```

The production server will serve the built frontend from the `dist` directory.

## Email Configuration

The platform uses the EmailIt API for sending emails. The following emails are sent automatically:

1. **Audit Started**: Sent when a user begins an audit
2. **Report Ready**: Sent when the audit report is generated (includes PDF link)
3. **Admin Notification**: Sent to admin when new audits are created

### EmailIt API Setup

- API Endpoint: `https://api.emailit.com/v1/emails`
- Authentication: Bearer token
- Required headers: `Authorization: Bearer {API_KEY}`, `Content-Type: application/json`

## Database Schema

### Tables

1. **audits** - Stores all audit submissions
2. **admin_users** - Stores admin user credentials
3. **audit_responses** - Stores detailed audit answers
4. **notifications** - Tracks email notifications

See `server/config/schema.sql` for complete schema.

## Security Considerations

- ✅ JWT-based authentication for admin access
- ✅ Password hashing with BCrypt
- ✅ Environment variables for sensitive data
- ✅ CORS enabled for API protection
- ✅ Input validation on all forms
- ✅ SQL injection prevention with parameterized queries
- ⚠️ Change default admin password immediately
- ⚠️ Use HTTPS in production
- ⚠️ Keep environment variables secure

## Deployment

### Domain Configuration

The platform is configured to run at:
- Production: `https://audit.bowtiekreative.com`
- Port: `1221`

### Deployment Checklist

- [ ] Update environment variables for production
- [ ] Change default admin password
- [ ] Configure SSL/TLS certificate
- [ ] Set up database backups
- [ ] Configure firewall rules
- [ ] Set up monitoring and logging
- [ ] Test email delivery
- [ ] Test PDF generation
- [ ] Verify all API endpoints

## Support & Contact

For questions or support:
- Email: ryan@bowtiekreative.com
- Website: https://audit.bowtiekreative.com

## License

ISC License - Copyright © 2024 Bowtie Kreative

## Acknowledgments

- EmailIt for email delivery service
- Headless UI for accessible components
- PDFKit for PDF generation
- All other open-source libraries used in this project
