
import StorylineModel from '../../models/storylineModel.js';
import promptModel from '../../models/promptModel.js';
import createStorylineFromTemplate from './createStorylineFromTemplate.js';

const createPromptAndStorylineObjects = async (dataFeed, storyId, templateName) => {
    // Create the storyline first


    const newStoryline = await createStorylineFromTemplate(templateName, storyId);
    const storylineId = newStoryline._id;
    const storyName = newStoryline.StoryName; // Ensure this attribute exists in newStoryline
    console.log("New Storyline ID:", storylineId);

    // Create prompts using the Prompts class
    const createdPrompts = await Promise.all(dataFeed.map(async feedItem => {
        const promptData = {
            order: feedItem.order,
            storyId: storyId,
            storylineId: storylineId,
            prompt: feedItem.prompt,
            twyneId: null, // or any specific value
            mediaType: null, // or any specific value
            promptTitle: feedItem.promptTitle
        };

        return await promptModel.create(promptData);
    }));

    try {
        const storyline = await StorylineModel.findById(storylineId);
        if (!storyline) {
            throw new Error("No storyline found with the given ID.");
        }

        // Fetch prompts from the database
        const promptsFromDb = await promptModel.findByStorylineId(storylineId);

        const storylineParts = storyline.getStorylineParts();

        // Link storyline parts with the corresponding prompts
        const storylineDataObjects = storylineParts.map(part => {
            const linkedPrompt = promptsFromDb.find(prompt => prompt.order === part.order);
            return {
                ...part,
                promptId: linkedPrompt ? linkedPrompt._id : null
            };
        });

        // Update each storyline part in the database with the associated promptId
        for (const part of storylineDataObjects) {
            if (part.promptId) {
                await StorylineModel.updateStorylinePartWithPromptId(storylineId, part.order, part.promptId);
            }
        }

        return {
            prompts: promptsFromDb,
            storylineDataObjects
        };
    } catch (error) {
        console.error("Error in createPromptAndStorylineObjects:", error);
        // Consider how you want to handle errors - perhaps rethrow or handle differently
    }
};

// Usage of the function

export default createPromptAndStorylineObjects;