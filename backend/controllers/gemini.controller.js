import Interview from '../models/interview.models.js';
import Resume from '../models/resume.model.js';
import { chatWithGemini, generateSimpleContent } from '../services/gemini.js';

/** Helper to fetch resume content */
async function getResumeContent(resumeId) {
  if (!resumeId) return { content: '', hasResume: false };
  try {
    const resume = await Resume.findById(resumeId);
    if (resume && resume.parsedText) return { content: resume.parsedText, hasResume: true };
  } catch (err) {
    console.warn('Error fetching resume:', err);
  }
  return { content: '', hasResume: false };
}




/** Strategy for creating system prompts based on resume presence */
function createSystemPrompt({ interview, resumeContent, hasResume, isFollowUp = false }) {
            if (hasResume) {
                      return `
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
                  - Avoid slashes (/) or symbols; keep a professional tone.
                  - Wait for the candidate to respond before continuing.
                  - Progress naturally through different aspects of their background.
                      `.trim();
            }

            // No resume scenario
            return `
            You are an interviewer conducting a mock interview.
            Candidate experience: ${interview.experienceYears} years

            Title: ${interview.title}
            Description: ${interview.description}

            Guidelines:
            - Ask questions strictly based on title and description.
            - Questions should be concise (1–4 lines).
            - Avoid slashes (/) or symbols; keep a professional tone.
            - Wait for the candidate to respond before continuing.
            `.trim();
}




/** Helper to chat with Gemini AI */
async function getAIResponse(history) {
  const aiMsg = await chatWithGemini(history);
  return aiMsg.content;
}

/** Reset interview chat */
function resetChat(interview) {
  interview.messages = [];
  interview.feedback = undefined;
  interview.finished = false;
}

/** --- Controllers --- */

/** Start a new mock interview */
export const startInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ error: 'Interview not found' });

    const { content: resumeContent, hasResume } = await getResumeContent(interview.resumeId);
    const systemPrompt = createSystemPrompt({ interview, resumeContent, hasResume });

    const aiContent = await getAIResponse([{ role: 'user', parts: [{ text: systemPrompt }] }]);

    resetChat(interview);
    interview.messages.push({ role: 'ai', content: aiContent });
    await interview.save();

    res.status(200).json({ message: { role: 'ai', content: aiContent }, hasResume });
  } catch (err) {
    console.error('Error in startInterview:', err);
    res.status(500).json({ error: err.message });
  }
};

/** Handle candidate reply */
export const sendUserMessage = async (req, res) => {
  try {
    const { content } = req.body;
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ error: 'Interview not found' });

    interview.messages.push({ role: 'user', content });
    const { content: resumeContent, hasResume } = await getResumeContent(interview.resumeId);

    const systemPrompt = createSystemPrompt({ interview, resumeContent, hasResume, isFollowUp: true });

    const history = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      ...interview.messages.map(m => ({
        role: m.role === 'ai' ? 'model' : 'user',
        parts: [{ text: m.content }],
      })),
    ];

    const aiContent = await getAIResponse(history);
    interview.messages.push({ role: 'ai', content: aiContent });
    await interview.save();

    res.status(200).json({ message: { role: 'ai', content: aiContent } });
  } catch (err) {
    console.error('Error in sendUserMessage:', err);
    res.status(500).json({ error: err.message });
  }
};

/** Finish interview with score and feedback */
export const finishInterview = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) return res.status(404).json({ error: 'Interview not found' });

    const { content: resumeContent } = await getResumeContent(interview.resumeId);

    const fullChat = interview.messages.map(m => `${m.role.toUpperCase()}: ${m.content}`).join('\n');
    const scoringContext = resumeContent ? `\n\nCANDIDATE'S RESUME:\n${resumeContent}` : '';

    const pointsResult = await generateSimpleContent(
      `You are a senior interviewer. Based on the following interview transcript, give a score out of 10 for the candidate's overall performance. Only return the number:\n\n${fullChat}${scoringContext}`
    );

    let points = parseFloat(pointsResult.content);
    points = Math.min(Math.max(points || 0, 0), 10); // Ensure points are between 0-10
    interview.points = points;

    const feedbackResult = await generateSimpleContent(
      `You are a senior interviewer. Give short, constructive feedback on the candidate's performance and communication:\n\n${fullChat}${scoringContext}`
    );
    interview.feedback = feedbackResult.content;
    interview.finished = true;

    await interview.save();
    res.status(200).json({ points: interview.points, feedback: interview.feedback });
  } catch (err) {
    console.error('Error in finishInterview:', err);
    res.status(500).json({ error: err.message });
  }
};

/** Get all interviews */
export const getAllInterviews = async (req, res) => {
  try {
    const data = await Interview.find()
      .populate('resumeId', 'filename originalName uploadDate')
      .sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    console.error('Error in getAllInterviews:', err);
    res.status(500).json({ error: err.message });
  }
};

/** Get interview with populated resume */
export const getInterviewWithResume = async (req, res) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('resumeId', 'filename originalName parsedText uploadDate');

    if (!interview) return res.status(404).json({ error: 'Interview not found' });

    res.status(200).json(interview);
  } catch (err) {
    console.error('Error in getInterviewWithResume:', err);
    res.status(500).json({ error: err.message });
  }
};
