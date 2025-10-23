import express from 'express';
import multer from 'multer';
import path from 'path';
import { 
  uploadResume, 
  listResumes, 
  deleteResume, 
  downloadResume, 
  renameResume 
} from '../controllers/resume.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();

// Configure Multer storage settings for resume uploads
const storage = multer.diskStorage({
  // Destination folder for uploaded resumes
  destination: function (req, file, cb) {
    cb(null, path.join(path.resolve(), 'backend', 'uploads', 'resumes'));
  },
  // Generate unique filename to prevent overwriting existing files
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// Initialize Multer middleware with the defined storage configuration
const upload = multer({ storage });


router.get('/test', (req, res) => res.json({ ok: true }));


router.post('/upload', verifyToken, upload.single('resume'), uploadResume);


router.get('/', verifyToken, listResumes);


router.delete('/:id', verifyToken, deleteResume);


router.get('/download/:id', verifyToken, downloadResume);


router.patch('/rename/:id', verifyToken, renameResume);

export default router;
