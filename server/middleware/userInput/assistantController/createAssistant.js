import dotenv from "dotenv";
dotenv.config();
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});
import { storyDirectorInstructions } from "../prompts/storyDirectorInstructions.js";



async function main() {
    const StoryDirector = await openai.beta.assistants.create({
        instructions: storyDirectorInstructions,
        name: "Story Director",
        tools: [
            { type: "retrieval" },
            {
                type: "function",
                function: {
                    name: "createRawNarrative",
                    description: "Creates a narrative for a wedding video based on given themes and durations.",
                    parameters: {
                        type: "object",
                        properties: {
                            name: { type: "string", description: "The title of the wedding narrative." },
                            theme: { type: "string", description: "Descriptive keywords for the narrative's style, e.g., 'Fun, High Energy, and Exciting'." },
                            totalTargetDuration: { type: "integer", description: "The total duration of the wedding video in milliseconds." },
                            rawNarrative: {
                                type: "array",
                                items: { type: "string" },
                                description: "List of video segments e.g., ['Title Sequence', 'Interview', 'Montage']."
                            },
                            bpm: { type: "integer", description: "Beats per minute, if applicable, for setting the pace of the video." }
                        },
                        required: ["name", "theme", "totalTargetDuration", "rawNarrative"]
                    }
                }
            }
        ],
        model: "gpt-4-turbo",
        file_ids: ["file-DiTgCcUmtCQwqNVUr5QFep0U"],
    });

    console.log(StoryDirector);
}

main();