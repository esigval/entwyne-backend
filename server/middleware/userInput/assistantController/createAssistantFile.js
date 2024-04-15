import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
export async function createAssistantFile(assistantId, fileId) {
  const myAssistantFile = await openai.beta.assistants.files.create(
    assistantId,
    {
      file_id: fileId
    }
  );
  return myAssistantFile;
}