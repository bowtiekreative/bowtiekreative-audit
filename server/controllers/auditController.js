import Audit from '../models/Audit.js';
import PDFGenerator from '../utils/pdfGenerator.js';
import EmailService from '../utils/emailService.js';
import dotenv from 'dotenv';

dotenv.config();

const APP_URL = process.env.APP_URL || 'http://localhost:1221';

export const createAudit = async (req, res) => {
  try {
    const auditData = req.body;

    // Create audit record (returns auditId and updateCode)
    const { auditId, updateCode } = await Audit.create(auditData);

    // Send notification that audit started with update code
    await EmailService.notifyAuditStarted(
      auditId,
      auditData.email,
      auditData.business_name,
      updateCode
    );

    res.status(201).json({
      success: true,
      message: 'Audit created successfully',
      auditId,
      updateCode
    });
  } catch (error) {
    console.error('Error creating audit:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create audit',
      error: error.message
    });
  }
};

export const generateReport = async (req, res) => {
  try {
    const { auditId } = req.params;

    // Get audit data
    const audit = await Audit.findById(auditId);
    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Audit not found'
      });
    }

    // Calculate scores
    const scores = PDFGenerator.calculateScores(audit);
    
    // Update scores in database
    await Audit.updateScores(auditId, scores);

    // Generate PDF report
    const { fileName, pdfPath } = await PDFGenerator.generateReport(audit, scores);
    
    // Update audit with PDF path
    await Audit.updateReport(auditId, fileName);

    // Construct PDF URL
    const pdfUrl = `${APP_URL}/pdfs/${fileName}`;

    // Send completion email with report
    await EmailService.notifyAuditCompleted(
      auditId,
      audit.email,
      audit.business_name,
      pdfUrl
    );

    res.json({
      success: true,
      message: 'Report generated successfully',
      pdfUrl,
      scores
    });
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate report',
      error: error.message
    });
  }
};

export const getAudit = async (req, res) => {
  try {
    const { auditId } = req.params;
    const audit = await Audit.findById(auditId);

    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Audit not found'
      });
    }

    res.json({
      success: true,
      audit
    });
  } catch (error) {
    console.error('Error fetching audit:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audit',
      error: error.message
    });
  }
};

export const getAuditsByEmail = async (req, res) => {
  try {
    const { email } = req.params;
    const audits = await Audit.findByEmail(email);

    res.json({
      success: true,
      audits
    });
  } catch (error) {
    console.error('Error fetching audits:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audits',
      error: error.message
    });
  }
};

export const getAllAudits = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const offset = parseInt(req.query.offset) || 0;

    const audits = await Audit.findAll(limit, offset);
    const stats = await Audit.getStats();

    res.json({
      success: true,
      audits,
      stats,
      pagination: {
        limit,
        offset
      }
    });
  } catch (error) {
    console.error('Error fetching audits:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch audits',
      error: error.message
    });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await Audit.getStats();
    res.json({
      success: true,
      stats
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch stats',
      error: error.message
    });
  }
};

// Verify update code and return audit data
export const verifyUpdateCode = async (req, res) => {
  try {
    const { updateCode, email } = req.body;

    if (!updateCode || !email) {
      return res.status(400).json({
        success: false,
        message: 'Update code and email are required'
      });
    }

    // Find audit by update code and email
    const audit = await Audit.findByUpdateCode(updateCode, email);

    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Invalid update code or email. Please check your credentials.'
      });
    }

    res.json({
      success: true,
      message: 'Update code verified successfully',
      audit
    });
  } catch (error) {
    console.error('Error verifying update code:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify update code',
      error: error.message
    });
  }
};

// Update audit with new data
export const updateAudit = async (req, res) => {
  try {
    const { updateCode, email, auditData } = req.body;

    if (!updateCode || !email) {
      return res.status(400).json({
        success: false,
        message: 'Update code and email are required'
      });
    }

    // Verify the update code and email match
    const audit = await Audit.findByUpdateCode(updateCode, email);

    if (!audit) {
      return res.status(404).json({
        success: false,
        message: 'Invalid update code or email'
      });
    }

    // Update the audit
    await Audit.update(audit.id, auditData);

    // Recalculate scores
    const updatedAudit = await Audit.findById(audit.id);
    const scores = PDFGenerator.calculateScores(updatedAudit);
    await Audit.updateScores(audit.id, scores);

    // Regenerate PDF report if it was already generated
    if (audit.report_generated) {
      const { fileName } = await PDFGenerator.generateReport(updatedAudit, scores);
      await Audit.updateReport(audit.id, fileName);
      const pdfUrl = `${APP_URL}/pdfs/${fileName}`;

      // Send email notification about the update
      await EmailService.notifyAuditUpdated(
        audit.id,
        email,
        auditData.business_name,
        pdfUrl
      );
    }

    res.json({
      success: true,
      message: 'Audit updated successfully',
      auditId: audit.id
    });
  } catch (error) {
    console.error('Error updating audit:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update audit',
      error: error.message
    });
  }
};
