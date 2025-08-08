import Interview from '../models/interview.models.js';
import Resume from '../models/resume.model.js';
import { generateQuestionsFromResume } from '../services/gemini.js';

// POST /api/interviews
export const createInterview = async (req, res) => { 
  console.log(req.userId);
  try { 
    const { title, description, experienceYears, resumeId } = req.body;

    // ✅ Ensure experienceYears is a number
    const years = Number(experienceYears);
    if (isNaN(years) || years < 0) {
      return res.status(400).json({ error: 'Invalid experienceYears value' });
    }

    let questions = [];
    if (resumeId) {
      const resume = await Resume.findById(resumeId);
      if (resume && resume.parsedText) {
        questions = await generateQuestionsFromResume(resume.parsedText);
      }
    }

    const doc = await Interview.create({
      title,
      description,
      experienceYears: years, // ✅ Now guaranteed to be a number
      user: req.userId,
      resume: resumeId || null,
      questions,
    });

    res.status(201).json(doc);
  } catch (e) {
    console.error('Error creating interview:', e);
    res.status(400).json({ error: e.message });
  }
};

// GET /api/interviews
export const getAllInterviews = async (req, res) => {
  try {
    const list = await Interview.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(list);
  } catch (e) {
    console.error('Error fetching interviews:', e);
    res.status(500).json({ error: e.message });
  }
};

// GET /api/interviews/:id
export const getInterviewById = async (req, res) => {
  try {
    const doc = await Interview.findOne({
      _id: req.params.id,
      user: req.userId,
    });

    if (!doc) return res.status(404).json({ error: 'Interview not found' });
    res.json(doc);
  } catch (e) {
    console.error('Error fetching interview by ID:', e);
    res.status(500).json({ error: e.message });
  }
};

// PATCH /api/interviews/:id/feedback
export const saveFeedback = async (req, res) => {
  try {
    const doc = await Interview.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { feedback: req.body.feedback },
      { new: true }
    );

    if (!doc) return res.status(404).json({ error: 'Interview not found or unauthorized' });
    res.sendStatus(204);
  } catch (e) {
    console.error('Error saving feedback:', e);
    res.status(500).json({ error: e.message });
  }
};

export const deleteInterview = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Interview.findOneAndDelete({ _id: id, user: req.userId });
    if (!deleted) return res.status(404).json({ error: 'Interview not found' });
    res.sendStatus(204);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
