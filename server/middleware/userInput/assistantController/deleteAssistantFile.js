import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function deleteAssistantFile(assistantId, fileId) {
  const file = await openai.beta.assistants.files.del(assistantId, fileId);
  console.log(file);
}
