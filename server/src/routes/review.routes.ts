import express from 'express';
import { authenticateJWT } from '../middleware/auth.middleware';
import { isAdmin } from '../middleware/role.middleware';
import { 
  getAllReviews, 
  getReviewById, 
  submitAppeal, 
  processAppeal 
} from '../controllers/review.controller';

const router = express.Router();

// Get all reviews (accessible by admin)
router.get('/', authenticateJWT, isAdmin, getAllReviews);

// Get review by ID
router.get('/:id', authenticateJWT, getReviewById);

// Submit appeal for a review
router.post('/:id/appeal', authenticateJWT, submitAppeal);

// Process appeal (admin only)
router.put('/:id/appeal', authenticateJWT, isAdmin, processAppeal);

export default router; 