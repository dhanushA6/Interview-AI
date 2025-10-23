import * as dotenv from 'dotenv'; 
import { GoogleGenerativeAI } from '@google/generative-ai';

// Load environment variables from .env file
dotenv.config();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const MODEL = 'gemini-2.5-flash'; 

if (!GEMINI_API_KEY) {
  throw new Error("GEMINI_API_KEY not found in environment variables.");
}

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

function formatAiMessage(text) {
  return { role: 'ai', content: text };
}

/**
 * Chat with Gemini AI using conversation history.
 * Purpose: Sends user chat history to Gemini and receives AI response.
 * Input:
 *   - history: array of message objects, each with role and content
 * Output:
 *   - On success: returns { role: 'ai', content: 'AI response text' }
 *   - On failure: returns fallback message { role: 'ai', content: 'Too many requests, limit exceeded' }
 */

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

/**
 * Generate simple content from a prompt using Gemini AI.
 * Purpose: Get AI-generated text from a basic text prompt.
 * Input:
 *   - prompt: string (text prompt to generate content)
 * Output:
 *   - On success: { role: 'ai', content: 'Generated text' }
 *   - On failure: { role: 'ai', content: 'Error generating content.' }
 */

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

/**
 * Extract text from a resume file (PDF or DOCX) using Gemini SDK.
 * Purpose: Parse resume content and return clean text.
 * Input:
 *   - base64Content: string (base64-encoded file content)
 *   - ext: string (file extension, e.g., '.pdf' or '.docx')
 * Output:
 *   - On success: string (extracted resume text)
 *   - On failure: empty string
 */
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

/**
 * Generate 5 technical interview questions from resume text.
 * Purpose: Create relevant interview questions based on candidate's resume.
 * Input:
 *   - resumeText: string (text content of the resume)
 * Output:
 *   - On success: array of strings (interview questions)
 *   - On failure: empty array
 */
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
