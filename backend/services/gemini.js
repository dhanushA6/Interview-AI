// utils/gemini.js (or wherever your file is)
import dotenv from 'dotenv';
import { GoogleGenerativeAI } from '@google/generative-ai';

dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const MODEL = 'gemini-1.5-flash-latest';

function formatAiMessage(text) {
  return { role: 'ai', content: text };
}

export const chatWithGemini = async (history) => {
  const model = genAI.getGenerativeModel({ model: MODEL });
  try {
    const chat = model.startChat({ history });
    const lastUserText = history.at(-1).parts[0].text;
    const result = await chat.sendMessage(lastUserText);
    const response = await result.response;
    return { role: 'ai', content: response.text() };
  } catch (err) {
    console.error('Error starting chat:', err);
    return { role: 'ai', content: 'Error communicating with Gemini.' };
  }
};

export const generateSimpleContent = async (prompt) => {
  const model = genAI.getGenerativeModel({ model: MODEL });
  const result = await model.generateContent(prompt);
  const response = await result.response;
  return formatAiMessage(response.text());
};
