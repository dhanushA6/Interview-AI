// routes/interviewRoutes.js
import express from 'express';
import {
  createInterview,
  getAllInterviews,
  getInterviewById,
  saveFeedback,
  deleteInterview
} from '../controllers/interview.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

router.post('/', verifyToken, createInterview);
router.get('/', verifyToken, getAllInterviews);
router.get('/:id', verifyToken, getInterviewById);
router.patch('/:id/feedback', verifyToken, saveFeedback);
router.delete('/:id', verifyToken, deleteInterview);

export default router;
