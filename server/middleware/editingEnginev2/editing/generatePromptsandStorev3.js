import Prompts from "../../../models/promptModel.js";
import { ObjectId } from 'mongodb';
import Twyne from "../../../models/twyneModel.js";
// import narrativeClips from "../rawDataTests/storylineStructure.json" assert { type: "json" };
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

const generateLLMPrompt = (block, twyneSummary) => {
    let llmPrompt = `You are creating a ${block.type.toLowerCase()} prompt for the user. The language should be personalized and in the second person, using specific names and descriptions of events. Keep the prompts short and focused on serving the story, which is the primary mandate.`;

    switch (block.type.toLowerCase()) {
        case 'interview':
            llmPrompt += ` Generate a short casual question that encourages the user to share their thoughts and experiences.`;
            break;
        case 'montage':
            llmPrompt += ` Generate a short prompt that encourages the user to upload images or videos highlighting key moments, especially focusing on key moments described in the scene instructions and clips. Keep entire prompt one sentence  .`;
            break;
        case 'title sequence':
        case 'title':
            llmPrompt += ` Generate a short prompt that guides the user in uploading the right clips for the title sequence. We automatically create the title overlay, so this is just focusing on a sequence of establishing shots - help with ideas in a few words. Keep entire prompt one sentence.`;
            break;
        case 'outro card':
        case 'card':
            llmPrompt += ` Generate a short prompt that will be used for uploading the final shots of the film. The user only needs to upload videos, the text is automatically generated. Keep entire prompt one sentence.`;
            break;
        default:
            llmPrompt += ` Generate an appropriate prompt for the user to provide content for this part of the video.`;
    }

    llmPrompt += `\n\nStory Summary: ${twyneSummary}.`;
    llmPrompt += `\n\nScene Instructions: ${block.blockInstructions}.`;

    if (block.clips && block.clips.length > 0) {
        llmPrompt += `\n\nConsider the following clips:\n`;
        block.clips.forEach((clip, index) => {
            llmPrompt += `${index + 1}. ${clip.prompt}\n`;
        });
    }

    return llmPrompt;
};

const promptSubmissionsLlm = async (prompt) => {
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini-2024-07-18",
            messages: [
                {
                    role: "system",
                    content: "Based on the summary of the clips, scene instructions, and the overall story summary provided by the user, format this into an actionable and personalized statement for the user."
                },
                {
                    role: "user",
                    content: prompt
                }
            ],
            max_tokens: 2000,
            temperature: 0,
        });
        console.log("Prompt Submissions LLM Response:", completion.choices[0].message.content);

        return completion.choices[0].message.content;
    } catch (error) {
        console.error("Error generating prompt from LLM:", error);
        throw error;
    }
};


const generateDirectedPrompts = async (block, twyneSummary) => {
    const promptText = generateLLMPrompt(block, twyneSummary);
    const completion = await promptSubmissionsLlm(promptText);
    return completion;
};

const generatePromptsAndAssociateWithBlocks = async (twyneId, storyId, storylineId, userId, storylineInstance, twyneSummary) => {
    try {
        console.log("Storyline Instance:", JSON.stringify(storylineInstance, null, 2));

        const promptsData = await Promise.all(storylineInstance.structure.map(async (block, index) => {
            const promptText = await generateDirectedPrompts(block, twyneSummary);
            const promptData = {
                order: block.order,
                twyneId: new ObjectId(twyneId),
                storylineId: storylineId ? new ObjectId(storylineId) : null,
                storyId: new ObjectId(storyId),
                prompt: promptText,
                mediaType: block.type,
                promptTitle: block.part,
                collected: "false",
                clipsToCollect: block.clipPace.quantity,
                clipsLength: block.clipPace.clipLength,
                userId: new ObjectId(userId),
                createdAt: new Date(),
                lastUpdated: new Date(),
            };

            console.log("Generated Prompt Data:", promptData);
            return promptData;
        }));

        console.log("Generated Prompts Array:", promptsData);

        const insertedPrompts = await Prompts.insertMany(promptsData);
        console.log("Inserted Prompts:", insertedPrompts);

        // Update storylineInstance with prompt objects
        const updatedStorylineInstance = { ...storylineInstance };
        updatedStorylineInstance.structure.forEach((block, index) => {
            block.promptId = insertedPrompts[index];

            // Check if sceneInstructions is null or doesn't exist and set it to promptText if so
            if (!block.sceneInstructions) {
                block.sceneInstructions = promptsData[index].prompt; // Corrected to promptsData[index].prompt
            }
        });

        return { insertedPrompts, updatedStorylineInstance };
    } catch (error) {
        console.error("Error during the prompt generation and storage process:", error);
        throw error;
    }
};


const generateAndStorePrompts = async (twyneId, storyId, storylineId, userId, storylineInstance, twyneSummary) => {
    try {
        const { insertedPrompts, updatedStorylineInstance } = await generatePromptsAndAssociateWithBlocks(twyneId, storyId, storylineId, userId, storylineInstance, twyneSummary);
        console.log("Inserted Prompts with IDs:", insertedPrompts.map(prompt => prompt.toString()));
        await Twyne.update(new ObjectId(twyneId), { prompts: insertedPrompts });
        return updatedStorylineInstance;
    } catch (error) {
        console.error("Error during the prompt generation and storage process:", error);
    }
};

export default generateAndStorePrompts;

// Simulated function call
// (async () => {
//     const updatedStorylineInstance = await generateAndStorePrompts(
//         '65f13b5b3c54a131c18aed0a',
//         '65e8f8ee5044800bdf5e840a',
//         '661725d87d971fe6ab48f089',
//         '660d81337b0c94b81b3f1744',
//         narrativeClips
//     );

//     console.log("Final Output:", JSON.stringify(updatedStorylineInstance, null, 2));
// })();
