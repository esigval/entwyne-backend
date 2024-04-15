import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function listFiles() {
  const list = await openai.files.list();
  const files = [];

  for await (const file of list) {
    files.push(file);
  }

  return files;
}

listFiles();