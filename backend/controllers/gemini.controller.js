import Interview from '../models/interview.models.js';
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

    const systemPrompt = `
You are an interviewer conducting a mock interview.
The candidate has ${interview.experienceYears} years of experience.
Begin with a friendly greeting, then ask a basic-level question related to the following:

Title: ${interview.title}
Description: ${interview.description}

Guidelines:
- Keep questions short (1–2 lines).
- Base your questions strictly on the title and description.
- Avoid slashes (/) or any symbols.
- Ask one question at a time and wait for the candidate's response.
    `.trim();

    const aiMsg = await chatWithGemini([
      { role: 'user', parts: [{ text: systemPrompt }] },
    ]);

    resetChat(interview);
    interview.messages.push({ role: 'ai', content: aiMsg.content });
    await interview.save();

    res.status(200).json({ message: { role: 'ai', content: aiMsg.content } });
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

    const systemPrompt = `
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

    const fullChat = interview.messages
      .map((m) => `${m.role.toUpperCase()}: ${m.content}`)
      .join('\n');

    const pointsPrompt = `You are a senior interviewer. Based on the following interview transcript, give a score out of 10 for the candidate's overall performance. Only return the number (no explanation):\n\n${fullChat}`;
    const pointsResult = await generateSimpleContent(pointsPrompt);

    let points = parseFloat(pointsResult.content);
    if (isNaN(points) || points < 0) points = 0;
    if (points > 10) points = 10;
    interview.points = points;

    const feedbackPrompt = `You are a senior interviewer. Give short feedback on the candidate's performance and communication:\n\n${fullChat}`;
    const feedback = await generateSimpleContent(feedbackPrompt);

    interview.feedback = feedback.content;
    interview.finished = true;
    await interview.save();

    res.status(200).json({ points: interview.points, feedback: interview.feedback });
  } catch (err) {
    console.error('Error in finishInterview:', err);
    res.status(500).json({ error: err.message });
  }
};

// Get all interviews
export const getAllInterviews = async (req, res) => {
  try {
    const data = await Interview.find().sort({ createdAt: -1 });
    res.status(200).json(data);
  } catch (err) {
    console.error('Error in getAllInterviews:', err);
    res.status(500).json({ error: err.message });
  }
};
