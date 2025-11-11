# Update Code Feature Documentation

## Overview

The Update Code feature allows users to return and modify their audit report information using a unique 4-digit code sent to their email. This provides flexibility for users to correct or update their information even after submitting the initial audit.

## How It Works

### 1. Code Generation
- When a user initiates an audit, a unique 4-digit code is automatically generated
- The code is stored securely in the database with the audit record
- Codes are guaranteed to be unique across all audits

### 2. Email Notification
- The 4-digit code is sent to the user's email immediately after audit initiation
- Email includes:
  - The 4-digit update code prominently displayed
  - A direct link to update the audit (code and email pre-filled)
  - Instructions on how to use the code

### 3. Verification Process
- Users can access the update form via the link in their email
- They must provide both:
  - Their 4-digit update code
  - The email address used for the audit
- Both credentials must match for access to be granted

### 4. Updating the Audit
- Users can modify any information in their original audit submission
- Upon saving changes:
  - Scores are recalculated automatically
  - PDF report is regenerated if previously generated
  - User receives an updated report via email

## API Endpoints

### Verify Update Code
```
POST /api/audits/verify-code
```

**Request Body:**
```json
{
  "updateCode": "1234",
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Update code verified successfully",
  "audit": {
    "id": 1,
    "business_name": "Example Business",
    "email": "user@example.com",
    // ... other audit fields
  }
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Invalid update code or email. Please check your credentials."
}
```

### Update Audit
```
PUT /api/audits/update
```

**Request Body:**
```json
{
  "updateCode": "1234",
  "email": "user@example.com",
  "auditData": {
    "business_name": "Updated Business Name",
    "contact_name": "John Doe",
    "phone": "123-456-7890",
    // ... other audit fields
  }
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Audit updated successfully",
  "auditId": 1
}
```

**Error Response (404):**
```json
{
  "success": false,
  "message": "Invalid update code or email"
}
```

## Database Changes

### Schema Update
Added `update_code` column to the `audits` table:

```sql
ALTER TABLE audits 
ADD COLUMN update_code VARCHAR(4) UNIQUE NOT NULL;
```

**Column Specifications:**
- Type: VARCHAR(4)
- Unique: Yes (enforced at database level)
- Not Null: Yes
- Index: Automatic via UNIQUE constraint

## Migration Instructions

### For New Installations
The `update_code` column is included in the main schema file (`server/config/schema.sql`). Simply run:

```bash
npm run init-db
```

### For Existing Databases
Run the migration script to add the column and generate codes for existing audits:

```bash
mysql -u audit -p audit < server/config/add-update-code-migration.sql
```

Or manually in MySQL:
```bash
mysql -u audit -p
use audit;
source server/config/add-update-code-migration.sql;
```

The migration script will:
1. Add the `update_code` column
2. Generate unique 4-digit codes for all existing audits
3. Set the column to NOT NULL after codes are generated

## Security Considerations

### Code Generation
- Uses cryptographically random numbers via `Math.random()`
- Guaranteed uniqueness through database constraint
- Retry logic ensures code generation succeeds

### Verification
- Requires both update code AND email address
- Email must match exactly (case-sensitive)
- Failed verification returns generic error message (no information leakage)

### Rate Limiting (Recommended)
Consider implementing rate limiting on the verification endpoint to prevent brute force attacks:

```javascript
// Example using express-rate-limit
import rateLimit from 'express-rate-limit';

const verifyCodeLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts per window
  message: 'Too many verification attempts, please try again later'
});

router.post('/verify-code', verifyCodeLimiter, verifyUpdateCode);
```

## Email Templates

### Audit Started Email
Updated to include:
- 4-digit update code in large, prominent display
- Direct "Update Your Audit" button with pre-filled parameters
- Instructions to save the code

### Audit Updated Email
New email template sent when user updates their audit:
- Confirmation of successful update
- Link to download updated PDF report
- Strategy call booking option

## Frontend Implementation

### Update Form Flow
1. User clicks link from email or navigates to `/update-audit?code=1234&email=user@example.com`
2. Form pre-fills with code and email from URL parameters
3. User verifies credentials (API call to `/api/audits/verify-code`)
4. Upon successful verification, form displays with current audit data
5. User makes changes and submits
6. API call to `/api/audits/update` with updated data
7. Success message displayed and updated report email sent

### URL Parameters
- `code`: The 4-digit update code
- `email`: User's email address (URL encoded)

Example: `https://audit.bowtiekreative.com/update-audit?code=1234&email=user%40example.com`

## Testing Checklist

- [ ] New audit generates unique 4-digit code
- [ ] Email contains update code and link
- [ ] Verify code endpoint validates correctly
- [ ] Invalid code/email combinations are rejected
- [ ] Update endpoint modifies audit data
- [ ] Scores are recalculated after update
- [ ] PDF report is regenerated if previously created
- [ ] Update confirmation email is sent
- [ ] Multiple updates to same audit work correctly
- [ ] Update codes remain unique across all audits

## Future Enhancements

### Potential Improvements
1. **Code Expiration**: Add expiration date for update codes (e.g., 30 days)
2. **Update History**: Track all changes made to audits with timestamps
3. **Email Verification**: Require email verification before updates
4. **Multiple Codes**: Generate new code for each update (one-time use)
5. **Admin Override**: Allow admins to regenerate update codes
6. **Update Limits**: Restrict number of updates per audit

## Troubleshooting

### User Lost Update Code
**Solution**: Implement a "Resend Code" feature that emails the code again after email verification.

### Code Already Used (Unique Constraint Error)
**Solution**: The system has retry logic (10 attempts) to generate a unique code. If this fails, increase retry attempts or implement longer codes.

### User Can't Update After Report Generated
**Solution**: The system allows updates at any time. The PDF is regenerated automatically after updates.

## Support

For questions or issues:
- Email: ryan@bowtiekreative.com
- Website: https://audit.bowtiekreative.com

## Version History

- **v1.1.0** (2024-11-11): Added 4-digit update code feature
  - Update code generation on audit creation
  - Email notification with update code and link
  - API endpoints for verification and updating
  - Automatic report regeneration on update
