import Interview from '../models/interview.models.js';
import Resume from '../models/resume.model.js';
import { generateQuestionsFromResume } from '../services/gemini.js';

// POST /api/interviews
// Purpose: Create a new interview for the logged-in user, optionally generating questions from a resume.
// Input (req.body): 
//   - title: string (title of the interview)
//   - description: string (description of the interview)
//   - experienceYears: number/string (years of experience, validated as number)
//   - resumeId: string (optional, ID of a resume to generate questions from)
// Input (req.userId): string (ID of the logged-in user, from authentication middleware)
// Output: 
//   - 201: JSON object of created interview with all fields including generated questions
//   - 400: JSON with error message if invalid input or creation fails

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
// Purpose: Fetch all interviews created by the logged-in user, sorted by newest first.
// Input (req.userId): string (ID of the logged-in user)
// Output:
//   - 200: JSON array of interview objects
//   - 500: JSON with error message if fetching fails

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
// Purpose: Fetch a single interview by its ID for the logged-in user.
// Input:
//   - req.params.id: string (ID of the interview)
//   - req.userId: string (ID of logged-in user)
// Output:
//   - 200: JSON object of the interview
//   - 404: JSON with error message if not found
//   - 500: JSON with error message if query fails

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
// Purpose: Save feedback for an interview created by the logged-in user.
// Input:
//   - req.params.id: string (ID of the interview)
//   - req.userId: string (ID of logged-in user)
//   - req.body.feedback: string (feedback content to save)
// Output:
//   - 204: No content if update successful
//   - 404: JSON with error message if interview not found or unauthorized
//   - 500: JSON with error message if update fails

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

// DELETE /api/interviews/:id
// Purpose: Delete an interview created by the logged-in user.
// Input:
//   - req.params.id: string (ID of the interview)
//   - req.userId: string (ID of logged-in user)
// Output:
//   - 204: No content if deletion successful
//   - 404: JSON with error message if interview not found
//   - 500: JSON with error message if deletion fails

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
