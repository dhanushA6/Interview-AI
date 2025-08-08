import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-1.5-flash-latest';

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

function formatAiMessage(text) {
  return { role: 'ai', content: text };
}

// Chat with Gemini using chat history
export const chatWithGemini = async (history) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL });
    const chat = model.startChat({ history });
    const lastUserText = history.at(-1)?.parts?.[0]?.text || '';
    const result = await chat.sendMessage(lastUserText);
    const response = await result.response;
    return { role: 'ai', content: response.text() };
  } catch (error) {
    console.error('Error in chatWithGemini:', error);
    return { role: 'ai', content: 'Too many requests , limit exceeded' };
  }
};

// Generate basic content from a prompt
export const generateSimpleContent = async (prompt) => {
  try {
    const model = genAI.getGenerativeModel({ model: MODEL });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return formatAiMessage(response.text());
  } catch (error) {
    console.error('Error in generateSimpleContent:', error);
    return formatAiMessage('Error generating content.');
  }
};

// Extract text from a resume file (PDF or DOCX) using SDK (no axios)
export async function parseResumeWithGemini(base64Content, ext) {
  const mimeType =
    ext === '.pdf'
      ? 'application/pdf'
      : 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

  const prompt = `Extract and return the clean text content from the following resume file.`;

  const model = genAI.getGenerativeModel({ model: MODEL });

  try {
    const result = await model.generateContent({
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: base64Content,
              },
            },
          ],
        },
      ],
    });

    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error in parseResumeWithGemini (SDK):', error);
    return '';
  }
}

// Generate 5 technical interview questions from resume text using SDK
export async function generateQuestionsFromResume(resumeText) {
  const prompt = `Given the following resume text, generate 5 technical interview questions relevant to the candidate's experience. Return the questions as a JSON array of strings.\n\nResume:\n${resumeText}`;

  const model = genAI.getGenerativeModel({ model: MODEL });

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    try {
      const questions = JSON.parse(text);
      return Array.isArray(questions) ? questions : [];
    } catch {
      // Fallback if not valid JSON
      return text.split('\n').filter(Boolean);
    }
  } catch (error) {
    console.error('Error in generateQuestionsFromResume (SDK):', error);
    return [];
  }
}
