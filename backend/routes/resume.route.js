import express from 'express';
import multer from 'multer';
import path from 'path';
import { uploadResume, listResumes, deleteResume, downloadResume, renameResume } from '../controllers/resume.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(path.resolve(), 'backend', 'uploads', 'resumes'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Test route to confirm router is loaded
router.get('/test', (req, res) => res.json({ ok: true }));

router.post('/upload', verifyToken, upload.single('resume'), uploadResume);
router.get('/', verifyToken, listResumes);
router.delete('/:id', verifyToken, deleteResume);
router.get('/download/:id', verifyToken, downloadResume);
router.patch('/rename/:id', verifyToken, renameResume);

export default router; 