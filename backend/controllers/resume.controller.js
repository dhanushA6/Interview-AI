import Resume from '../models/resume.model.js';
import path from 'path';
import fs from 'fs';
import { parseResumeWithGemini } from '../services/gemini.js';

// List all resumes for a user
export const listResumes = async (req, res) => {
  try {
    const resumes = await Resume.find({ userId: req.userId });
    res.json(resumes);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch resumes' });
  }
};

// Upload a resume and parse with Gemini
export const uploadResume = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  try {
    const ext = path.extname(req.file.originalname).toLowerCase();
    const filePath = path.join(path.resolve(), 'backend', 'uploads', 'resumes', req.file.filename);
    const fileBuffer = fs.readFileSync(filePath);
    const base64Content = fileBuffer.toString('base64');
    const parsedText = await parseResumeWithGemini(base64Content, ext);
    const resume = new Resume({
      userId: req.userId,
      filename: req.file.filename,
      originalName: req.file.originalname,
      parsedText,
    });
    await resume.save();
    res.status(201).json(resume);
  } catch (err) {
    res.status(500).json({ error: 'Failed to upload or parse resume' });
  }
};

// Delete a resume
export const deleteResume = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findOneAndDelete({ _id: id, userId: req.userId });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    // Delete file from disk
    const filePath = path.join(path.resolve(), 'backend', 'uploads', 'resumes', resume.filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    res.sendStatus(204);
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete resume' });
  }
};

// Download a resume
export const downloadResume = async (req, res) => {
  try {
    const { id } = req.params;
    const resume = await Resume.findOne({ _id: id, userId: req.userId });
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    const filePath = path.join(path.resolve(), 'backend', 'uploads', 'resumes', resume.filename);
    if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found' });
    res.download(filePath, resume.originalName);
  } catch (err) {
    res.status(500).json({ error: 'Failed to download resume' });
  }
};

// Rename a resume
export const renameResume = async (req, res) => {
  try {
    const { id } = req.params;
    const { newName } = req.body;
    if (!newName) return res.status(400).json({ error: 'New name required' });
    const resume = await Resume.findOneAndUpdate(
      { _id: id, userId: req.userId },
      { originalName: newName },
      { new: true }
    );
    if (!resume) return res.status(404).json({ error: 'Resume not found' });
    res.json(resume);
  } catch (err) {
    res.status(500).json({ error: 'Failed to rename resume' });
  }
};