import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

async function deleteFile(fileId) {
    const file = await openai.files.del(fileId);

    console.log(file);
}

export { deleteFile }; // Exporting the deleteFile function

