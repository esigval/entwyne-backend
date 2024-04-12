import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function deleteAssistantFile(fileId) {
  const file = await openai.files.del(fileId);
  console.log(file);
}

const fileId = "file-tJsKyARwnlnkuMzPV8Tukr8n";

deleteAssistantFile(fileId);