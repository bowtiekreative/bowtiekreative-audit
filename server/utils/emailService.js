import axios from 'axios';
import dotenv from 'dotenv';
import pool from '../config/database.js';

dotenv.config();

const EMAILIT_API_URL = process.env.EMAILIT_API_URL || 'https://api.emailit.com/v1';
const EMAILIT_API_KEY = process.env.EMAILIT_API_KEY;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'ryan@bowtiekreative.com';

class EmailService {
  static async sendEmail({ to, subject, html, replyTo = ADMIN_EMAIL, attachments = [] }) {
    try {
      const payload = {
        from: `Bowtie Kreative <${ADMIN_EMAIL}>`,
        to,
        reply_to: replyTo,
        subject,
        html,
        text: html.replace(/<[^>]*>/g, '') // Strip HTML for text version
      };

      // Add attachments if provided
      if (attachments.length > 0) {
        payload.attachments = attachments;
      }

      const response = await axios.post(
        `${EMAILIT_API_URL}/emails`,
        payload,
        {
          headers: {
            'Authorization': `Bearer ${EMAILIT_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log('✅ Email sent successfully:', to);
      return { success: true, data: response.data };
    } catch (error) {
      console.error('❌ Email send failed:', error.response?.data || error.message);
      return { success: false, error: error.response?.data || error.message };
    }
  }

  static async notifyAuditStarted(auditId, userEmail, businessName) {
    const subject = '🎯 Your Digital Audit Has Started!';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎯 Audit Started!</h1>
          </div>
          <div class="content">
            <h2>Hello ${businessName}!</h2>
            <p>Thank you for starting your digital marketing audit with Bowtie Kreative. We're excited to help you unlock your business's full potential!</p>
            <p><strong>What happens next?</strong></p>
            <ul>
              <li>We're analyzing your digital presence</li>
              <li>Evaluating your marketing strategies</li>
              <li>Assessing your automation capabilities</li>
              <li>Preparing personalized recommendations</li>
            </ul>
            <p>Your comprehensive audit report will be ready shortly and sent to your email.</p>
            <p>In the meantime, if you'd like personalized guidance, consider booking a strategy call:</p>
            <a href="https://bookme.name/digitalstemcell/lite/schedule-a-consultation-appointment-1" class="button">Book Strategy Call ($250)</a>
          </div>
          <div class="footer">
            <p>© 2024 Bowtie Kreative. All rights reserved.</p>
            <p>Need help? Contact us at ${ADMIN_EMAIL}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to user
    await this.sendEmail({ to: userEmail, subject, html });

    // Notify admin
    await this.sendEmail({
      to: ADMIN_EMAIL,
      subject: `🚨 New Audit Started - ${businessName}`,
      html: `
        <h2>New Audit Started</h2>
        <p><strong>Business:</strong> ${businessName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Audit ID:</strong> ${auditId}</p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `
    });

    // Log notification
    await pool.query(
      'INSERT INTO notifications (audit_id, notification_type, sent_to, status) VALUES (?, ?, ?, ?)',
      [auditId, 'audit_started', userEmail, 'sent']
    );
  }

  static async notifyAuditCompleted(auditId, userEmail, businessName, pdfUrl) {
    const subject = '✅ Your Digital Audit Report is Ready!';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .score-card { background: white; padding: 20px; border-radius: 10px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>✅ Your Report is Ready!</h1>
          </div>
          <div class="content">
            <h2>Hello ${businessName}!</h2>
            <p>Great news! Your comprehensive digital marketing audit is complete.</p>
            <div class="score-card">
              <h3>📊 Your Audit Report Includes:</h3>
              <ul>
                <li>✓ Website & Digital Presence Analysis</li>
                <li>✓ Social Media Performance Review</li>
                <li>✓ Marketing Strategy Evaluation</li>
                <li>✓ Automation & Technology Assessment</li>
                <li>✓ Actionable Recommendations</li>
                <li>✓ Competitive Insights</li>
              </ul>
            </div>
            <p><strong>Download your personalized report:</strong></p>
            <a href="${pdfUrl}" class="button">Download PDF Report</a>
            <p>Want to discuss your results and create an action plan?</p>
            <a href="https://bookme.name/digitalstemcell/lite/schedule-a-consultation-appointment-1" class="button" style="background: #10b981;">Book Strategy Call ($250)</a>
          </div>
          <div class="footer">
            <p>© 2024 Bowtie Kreative. All rights reserved.</p>
            <p>Questions? Contact us at ${ADMIN_EMAIL}</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Send to user
    await this.sendEmail({ to: userEmail, subject, html });

    // Notify admin
    await this.sendEmail({
      to: ADMIN_EMAIL,
      subject: `✅ Audit Completed - ${businessName}`,
      html: `
        <h2>Audit Completed</h2>
        <p><strong>Business:</strong> ${businessName}</p>
        <p><strong>Email:</strong> ${userEmail}</p>
        <p><strong>Audit ID:</strong> ${auditId}</p>
        <p><strong>Report:</strong> <a href="${pdfUrl}">View PDF</a></p>
        <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
      `
    });

    // Log notification
    await pool.query(
      'INSERT INTO notifications (audit_id, notification_type, sent_to, status) VALUES (?, ?, ?, ?)',
      [auditId, 'report_generated', userEmail, 'sent']
    );
  }
}

export default EmailService;
