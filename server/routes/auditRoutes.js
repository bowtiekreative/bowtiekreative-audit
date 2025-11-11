import express from 'express';
import {
  createAudit,
  generateReport,
  getAudit,
  getAuditsByEmail,
  getAllAudits,
  getStats,
  verifyUpdateCode,
  updateAudit
} from '../controllers/auditController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createAudit);
router.get('/:auditId', getAudit);
router.get('/email/:email', getAuditsByEmail);
router.post('/:auditId/report', generateReport);

// Update code routes (public)
router.post('/verify-code', verifyUpdateCode);
router.put('/update', updateAudit);

// Admin routes
router.get('/admin/all', authenticateToken, getAllAudits);
router.get('/admin/stats', authenticateToken, getStats);

export default router;
