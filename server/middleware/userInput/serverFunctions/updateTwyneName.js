import OpenAI from 'openai';
import dotenv from "dotenv";
import listMessages from '../assistantFunctions/listMessages.js';

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const twyneNamingFunction = async (threadId, trigger) => {
    const threadHistory = await listMessages(threadId);
    console.log('threadLength', threadHistory.threadLength); // Log the thread history

    if (threadHistory.threadLength >= trigger) {
        const message = `Hello, your job is to analyze the thread history and come up with a short name (preferably 3 to 4 words) that summarizes the name of the Twyne we are creating with context. Please return it as json formatted as {name: Title}. For context, The Twyne is a video short story. Get somewhat specific. Here is the ${threadHistory.messageHistory}`;
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
        return { name: "The thread length does not meet the trigger condition." }; // Return a JSON object as a default message
    }
};

export default twyneNamingFunction;

