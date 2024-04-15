import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function listAssistantFiles(assistantId) {
    const assistantFiles = await openai.beta.assistants.files.list(
        assistantId
    );
    console.log(assistantFiles.data);
    return assistantFiles;
}

listAssistantFiles('asst_HW7vJdo7CPOjz5ffrebd2Hw9');