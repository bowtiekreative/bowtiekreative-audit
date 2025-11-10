import express from 'express';
import {
  createAudit,
  generateReport,
  getAudit,
  getAuditsByEmail,
  getAllAudits,
  getStats
} from '../controllers/auditController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.post('/', createAudit);
router.get('/:auditId', getAudit);
router.get('/email/:email', getAuditsByEmail);
router.post('/:auditId/report', generateReport);

// Admin routes
router.get('/admin/all', authenticateToken, getAllAudits);
router.get('/admin/stats', authenticateToken, getStats);

export default router;
