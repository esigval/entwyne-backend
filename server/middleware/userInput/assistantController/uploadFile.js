import fs from "fs";
import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Uploads a file to OpenAI.
 *
 * @param {string} filePath - The path of the file to upload.
 * @param {string} purpose - The purpose of the file. Can be "answers", "knowledge", "fine-tune", or "chat".
 */
export async function uploadFile(filePath, purpose) {
  const file = await openai.files.create({
    file: fs.createReadStream(filePath),
    purpose: purpose,
  });

  return file;
}