import Twyne from "../../models/twyneModel.js";
import NarrativeStyles from "../../models/narrativeStylesModel.js";
import OpenAI from "openai";
import dotenv from "dotenv";
dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const fetchDocuments = async (twyneId, narrativeName) => {
    const twyne = await Twyne.findById(twyneId);
    const storySummary = twyne.storySummary;
    const narrativeStyle = await NarrativeStyles.findByName(narrativeName);

    return { storySummary, narrativeStyle };
};

const prepareDataForLLM = ({ storySummary, narrativeStyle }) => {
    // Remove unnecessary spaces in JSON string
    const narrativeStyleStr = JSON.stringify(narrativeStyle).replace(/\s+/g, '');

    // Construct the prompt
    const prompt = `Based on the following story summary: "${storySummary}" and this narrative style: ${narrativeStyleStr}, fill in each "instruction" key for each structural part in the narrative template. Please return the instructions with their Order Number as a key, formatted as a JSON, when formatting, only return a JSON object with no spaces or backticks, it should be an exact object`;
    return prompt;
};

const generateFromLlm = async (prompt) => {
    const completion = await openai.chat.completions.create({
        model: "gpt-4-0125-preview",
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

const generateInstructions = async (twyneId, narrativeName) => {
    // Fetch documents from the database
    const { storySummary, narrativeStyle } = await fetchDocuments(twyneId, narrativeName);

    // Prepare data for LLM
    const prompt = prepareDataForLLM({ storySummary, narrativeStyle });

    const llmResponse = await generateFromLlm(prompt);

    return llmResponse.message.content;

   
};

export default generateInstructions;

