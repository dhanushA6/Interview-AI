import Interview from '../models/interview.models.js';
import Resume from '../models/resume.model.js'; // Import Resume model
import { chatWithGemini, generateSimpleContent } from '../services/gemini.js';

// Reset interview state before starting again
function resetChat(interview) {
  interview.messages = [];
  interview.feedback = undefined;
  interview.finished = false;
}

// Start the mock interview
export const startInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      console.error('Interview not found for ID:', req.params.id);
      return res.status(404).json({ error: 'Interview not found' });
    }

    // Check if resume exists and fetch resume data
    let resumeContent = '';
    let hasResume = false;
    
    if (interview.resumeId) {
      try {
        const resume = await Resume.findById(interview.resumeId);
        if (resume && resume.parsedText) {
          resumeContent = resume.parsedText;
          hasResume = true;
        }
      } catch (resumeError) {
        console.warn('Error fetching resume:', resumeError);
        // Continue without resume if there's an error
      }
    }

    // Create system prompt based on whether resume is available
    let systemPrompt;
    
    if (hasResume) {
      systemPrompt = `
You are an interviewer conducting a mock interview.
The candidate has ${interview.experienceYears} years of experience.

CANDIDATE'S RESUME CONTENT:
${resumeContent}

JOB DETAILS:
Title: ${interview.title}
Description: ${interview.description}

Begin with a friendly greeting and ask the candidate to introduce themselves. Then ask questions based on:
1. First priority: Information from their resume (skills, projects, experience mentioned)
2. Second priority: The job title and description provided

Guidelines:
- Keep questions short (1–2 lines).
- Ask personalized questions based on their resume content when possible.
- If asking about resume items, be specific (e.g., "Tell me about the [specific project/skill] mentioned in your resume").
- Avoid slashes (/) or any symbols.
- Ask one question at a time and wait for the candidate's response.
- Make the interview feel natural and conversational.
      `.trim();
    } else {
      systemPrompt = `
You are an interviewer conducting a mock interview.
The candidate has ${interview.experienceYears} years of experience.
Begin with a friendly greeting and ask them to introduce themselves, then ask a basic-level question related to the following:

Title: ${interview.title}
Description: ${interview.description}

Guidelines:
- Keep questions short (1–2 lines).
- Base your questions strictly on the title and description.
- Avoid slashes (/) or any symbols.
- Ask one question at a time and wait for the candidate's response.
      `.trim();
    }

    const aiMsg = await chatWithGemini([
      { role: 'user', parts: [{ text: systemPrompt }] },
    ]);

    resetChat(interview);
    interview.messages.push({ role: 'ai', content: aiMsg.content });
    await interview.save();

    res.status(200).json({ 
      message: { role: 'ai', content: aiMsg.content },
      hasResume: hasResume
    });
  } catch (err) {
    console.error('Error in startInterview:', err);
    res.status(500).json({ error: err.message });
  }
};

// Handle candidate replies
export const sendUserMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ error: 'Interview not found' });

    interview.messages.push({ role: 'user', content });

    // Check if resume exists and fetch resume data
    let resumeContent = '';
    let hasResume = false;
    
    if (interview.resumeId) {
      try {
        const resume = await Resume.findById(interview.resumeId);
        if (resume && resume.parsedText) {
          resumeContent = resume.parsedText;
          hasResume = true;
        }
      } catch (resumeError) {
        console.warn('Error fetching resume:', resumeError);
      }
    }

    // Create system prompt based on whether resume is available
    let systemPrompt;
    
    if (hasResume) {
      systemPrompt = `
You are an interviewer conducting a mock interview.
Candidate experience: ${interview.experienceYears} years

CANDIDATE'S RESUME CONTENT:
${resumeContent}

JOB DETAILS:
Title: ${interview.title}
Description: ${interview.description}

Guidelines:
- Ask questions based on their resume content first, then job requirements.
- Questions should be within 4 lines max.
- Be specific about resume items when asking questions.
- Avoid slashes (/) or any symbols; keep a professional tone.
- Wait for the candidate to respond before continuing.
- Progress naturally through different aspects of their background.
      `.trim();
    } else {
      systemPrompt = `
You are an interviewer conducting a mock interview.
Candidate experience: ${interview.experienceYears} years

Title: ${interview.title}
Description: ${interview.description}

Guidelines:
- Ask questions strictly based on title and description.
- First question should be basic; next ones within 4 lines max.
- Avoid slashes (/) or any symbols; keep a professional tone.
- Wait for the candidate to respond before continuing.
      `.trim();
    }

    const history = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...interview.messages.map((m) => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
    ];

    const aiMsg = await chatWithGemini(history);
    interview.messages.push({ role: 'ai', content: aiMsg.content });
    await interview.save();

    res.status(200).json({ message: { role: 'ai', content: aiMsg.content } });
  } catch (err) {
    console.error('Error in sendUserMessage:', err);
    res.status(500).json({ error: err.message });
  }
};

// Finish the interview and generate score + feedback
export const finishInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ error: 'Interview not found' });

    // Get resume content for more accurate feedback
    let resumeContent = '';
    if (interview.resumeId) {
      try {
        const resume = await Resume.findById(interview.resumeId);
        if (resume && resume.parsedText) {
          resumeContent = resume.parsedText;
        }
      } catch (resumeError) {
        console.warn('Error fetching resume for feedback:', resumeError);
      }
    }

    const fullChat = interview.messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');

    // Enhanced scoring prompt that considers resume
    const scoringContext = resumeContent 
      ? `\n\nCANDIDATE'S RESUME:\n${resumeContent}`
      : '';

    const pointsPrompt = `You are a senior interviewer. Based on the following interview transcript, give a score out of 10 for the candidate's overall performance. Consider their responses in context of their background. Only return the number (no explanation):\n\n${fullChat}${scoringContext}`;
    const pointsResult = await generateSimpleContent(pointsPrompt);

    let points = parseFloat(pointsResult.content);
    if (isNaN(points) || points < 0) points = 0;
    if (points > 10) points = 10;
    interview.points = points;

    // Enhanced feedback prompt that considers resume
    const feedbackPrompt = `You are a senior interviewer. Give short, constructive feedback on the candidate's performance and communication. Consider how well they presented their background and skills. Be specific and actionable:\n\n${fullChat}${scoringContext}`;
    const feedback = await generateSimpleContent(feedbackPrompt);

    interview.feedback = feedback.content;
    interview.finished = true;
    await interview.save();

    res.status(200).json({ 
      points: interview.points, 
      feedback: interview.feedback 
    });
  } catch (err) {
    console.error('Error in finishInterview:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all interviews
export const getAllInterviews = async (req, res) => {
  try {
    const data = await Interview.find()
      .populate('resumeId', 'filename originalName uploadDate') // Populate resume info if needed
      .sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    console.error('Error in getAllInterviews:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get interview with resume details (optional helper function)
export const getInterviewWithResume = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('resumeId', 'filename originalName parsedText uploadDate');
    
    if (!interview) {
      return res.status(404).json({ error: 'Interview not found' });
    }

    res.status(200).json(interview);
  } catch (err) {
    console.error('Error in getInterviewWithResume:', err);
    res.status(500).json({ error: err.message });
  }
};