import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function main() {
  const myAssistants = await openai.beta.assistants.list({
    order: "desc",
    limit: "20",
  });

  console.log(myAssistants.data);
}

main();