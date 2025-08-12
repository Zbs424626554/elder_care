import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import { 
  getAllComplaints, 
  getComplaintById, 
  createComplaint, 
  updateComplaintStatus
} from '../controllers/complaint.controller';

const router = express.Router();

// Get all complaints (admin only)
router.get('/', authenticateJWT, isAdmin, getAllComplaints);

// Get complaint by ID
router.get('/:id', authenticateJWT, getComplaintById);

// Create a new complaint
router.post('/', authenticateJWT, createComplaint);

// Update complaint status (admin only)
router.put('/:id/status', authenticateJWT, isAdmin, updateComplaintStatus);

export default router; 