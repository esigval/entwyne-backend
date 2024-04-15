import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function createThread() {
  const emptyThread = await openai.beta.threads.create();

  console.log(emptyThread);
  return emptyThread;
}

export default createThread;