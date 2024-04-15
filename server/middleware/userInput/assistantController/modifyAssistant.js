import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
/**
 * Updates an assistant.
 *
 * @param {string} assistantId - The ID of the assistant to update.
 * @param {string} instructions - The instructions for the assistant.
 * @param {string} name - The name of the assistant.
 * @param {Array} tools - An array of tools for the assistant. Each tool is an object with a `type` property.
 * @param {string} model - The model of the assistant.
 * @param {Array} fileIds - An array of file IDs for the assistant.
 */
export async function updateAssistant(assistantId, instructions, name, tools, model, fileIds) {
  const myUpdatedAssistant = await openai.beta.assistants.update(
    assistantId,
    {
      instructions: instructions,
      name: name,
      tools: tools,
      model: model,
      file_ids: fileIds,
    }
  );

  console.log(myUpdatedAssistant);
}

updateAssistant('asst_HW7vJdo7CPOjz5ffrebd2Hw9', 'This is a test assistant.', 'Test Assistant', [{ type: 'davinci' }],);