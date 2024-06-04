import OpenAI from 'openai';
import dotenv from "dotenv";
import generateSubDivisionPrompt from '../promptScripts/subdivisionScriptPrompt.js';
import parseLLMResponseToJson from './parseLLMResponseToJson.js';
import { ObjectId } from 'mongodb';
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const subdivisionLlm = async (prompt) => {
  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo-0125",
    messages: [
      {
        role: "system",
        content: "You are my scene director who will help make me decisions about a scene and transform it into individual cuts. Be precise, and ultimately, we'll want engaging prompts created"
      },
      {
        role: "user",
        content: prompt
      }
    ],
    max_tokens: 1000,
    temperature: 0,
  });

  return completion.choices[0];
};