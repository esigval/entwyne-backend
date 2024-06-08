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

const generateLLMPrompt = (block) => {
    let llmPrompt = `You are creating a ${block.type.toLowerCase()} prompt for the user. The language `;

    switch (block.type.toLowerCase()) {
        case 'interview':
            llmPrompt += ` The user needs to provide insights or personal perspectives. Generate a question that encourages them to share their thoughts and experiences.`;
            break;
        case 'montage':
            llmPrompt += ` The user needs to upload pictures or videos highlighting key moments. Generate a prompt that encourages them to upload images or videos, especially focusing on key moments described in the scene instructions and clips.`;
            break;
        case 'title sequence':
        case 'title':
            llmPrompt += ` The user needs to create an engaging title sequence for their video. Generate a prompt that guides them in creating a catchy title showcasing the theme of reflection and journey. Generally, titles will have montage with overlay, so focus on good establishing shots that could support the scene`;
            break;
        case 'outro card':
        case 'card':
            llmPrompt += ` The user needs to summarize the journey and its significance in a concluding message. Generate a prompt that guides them in creating a conclusion video or image that summarizes their story`;
            break;
        default:
            llmPrompt += ` The user needs to provide content for this part of the video. Generate an appropriate prompt for them.`;
    }

    llmPrompt += `\n\nScene Instructions: ${block.sceneInstructions}.`;

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
            model: "gpt-3.5-turbo-0125",
            messages: [
                {
                    role: "system",
                    content: "Taking the summary of the clips, and the scene instructions, and finally, I will format this to be an actionable statement to the user."
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

const generateDirectedPrompts = async (block) => {
    const promptText = generateLLMPrompt(block);
    const completion = await promptSubmissionsLlm(promptText);
    return completion;
};

const generatePromptsAndAssociateWithBlocks = async (twyneId, storyId, storylineId, userId, storylineInstance) => {
    try {
        console.log("Storyline Instance:", JSON.stringify(storylineInstance, null, 2));

        const promptsData = await Promise.all(storylineInstance.structure.map(async (block, index) => {
            const promptText = await generateDirectedPrompts(block);
            const promptData = {
                order: block.order,
                twyneId: new ObjectId(twyneId),
                storylineId: storylineId ? new ObjectId(storylineId) : null,
                storyId: new ObjectId(storyId),
                prompt: promptText,
                mediaType: block.type,
                promptTitle: block.part,
                collected: "false",
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
        });

        return { insertedPrompts, updatedStorylineInstance };
    } catch (error) {
        console.error("Error during the prompt generation and storage process:", error);
        throw error;
    }
};

const generateAndStorePrompts = async (twyneId, storyId, storylineId, userId, storylineInstance) => {
    try {
        const { insertedPrompts, updatedStorylineInstance } = await generatePromptsAndAssociateWithBlocks(twyneId, storyId, storylineId, userId, storylineInstance);
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
