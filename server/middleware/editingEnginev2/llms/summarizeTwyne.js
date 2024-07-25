import OpenAI from 'openai';
import dotenv from "dotenv";
import listMessages from '../../userInput/assistantFunctions/listMessages.js';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const twyneSummarizingFunction = async (threadId, trigger) => {
    const threadHistory = await listMessages(threadId);
    console.log('threadLength', threadHistory.threadLength); // Log the thread history

    if (threadHistory.threadLength >= trigger) {
        const message = `Hello, your job is to analyze the thread history and provide a concise summary of the story - describe it as a story not a thread. The summary should capture the main events and themes in a few sentences. Respond in json with { twyneSummary: response} Here is the thread history: ${threadHistory.messageHistory}`;
        const completion = await openai.chat.completions.create({
            messages: [{ role: "system", content: message }],
            model: "gpt-4o-mini-2024-07-18",
            response_format: { "type": "json_object" },
        });

        try {
            // Attempt to parse the content to ensure it's valid JSON
            const parsedContent = JSON.parse(completion.choices[0].message.content);
            console.log(parsedContent); // Log the parsed JSON object
            return parsedContent; // Return the parsed JSON object
        } catch (error) {
            console.error("Failed to parse content as JSON:", error);
            // Handle the error (e.g., return a default value or rethrow the error)
            return { error: "Failed to parse content as JSON" };
        }
    } else {
        console.log("The thread length does not meet the trigger condition.");
        return { message: "The thread length does not meet the trigger condition." }; // Return a JSON object as a default message
    }
};

export default twyneSummarizingFunction;