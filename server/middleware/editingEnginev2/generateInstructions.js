import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const prepareDataForLLM = ({ storySummary, narrative }) => {
    // Create a deep copy of narrative
    const narrativeCopy = JSON.parse(JSON.stringify(narrative));

    // Convert suggestedDuration to rounded seconds
    narrativeCopy.structure.forEach(block => {
        if (block.suggestedDuration) {
            block.suggestedDuration = Math.round(block.suggestedDuration / 1000);
        }
    });

    // Remove unnecessary spaces in JSON string
    const narrativeStyleStr = JSON.stringify(narrativeCopy).replace(/\s+/g, '');

    // Construct the prompt
    const prompt = `Based on the following story summary: "${storySummary}", the narrative style: ${narrativeStyleStr}, and the suggested duration (in seconds) for each part, fill in the "sceneInstructions" key for each structural part in the narrative template. Please consider the suggested duration when generating instructions and aim for this length of time. Return the instructions with their Order Number as a key, formatted as a JSON. The format should be: {"0": {"sceneInstructions": {YOUR_INSTRUCTIONS_HERE}}}. When formatting, only return a JSON object with no spaces or backticks, it should be an exact object`;
    return prompt;
};

const generateFromLlm = async (prompt) => {
    const completion = await openai.chat.completions.create({
        model: "gpt-4-turbo",
        messages: [
            {
                role: "system",
                content: "You are a helpful assistant."
            },
            {
                role: "user",
                content: prompt
            }
        ],
        max_tokens: 1000,
        temperature: 0,
    });

    return completion.choices[0];
};

const generateInstructions = async (storySummary, narrative) => {
    // Prepare data for LLM
    const prompt = prepareDataForLLM({ storySummary, narrative });

    const llmResponse = await generateFromLlm(prompt);

    return llmResponse.message.content;
};

export default generateInstructions;