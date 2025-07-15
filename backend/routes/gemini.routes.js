// routes/gemini.routes.js
import express from 'express';
import {
  getAllInterviews,
  startInterview,
  sendUserMessage,
  finishInterview
} from '../controllers/gemini.controller.js';

const router = express.Router();

router.get('/', getAllInterviews);
router.post('/:id/start', startInterview);
router.post('/:id/message', sendUserMessage);
router.post('/:id/finish', finishInterview);

export default router;
