
import StorylineModel from '../../models/storylineModel.js';
import promptModel from '../../models/promptModel.js';
import createStorylineFromTemplate from './createStorylineFromTemplate.js';

const createPromptAndStorylineObjects = async (dataFeed, storyId, templateName) => {
    // Create the storyline first

    console.log("dataFeed:", dataFeed);


    const newStoryline = await createStorylineFromTemplate(templateName, storyId);
    const storylineId = newStoryline._id;
    console.log("New Storyline ID:", storylineId);
    console.log("Storyline Parts:", newStoryline.storylineParts);

    // Create prompts using the Prompts class
    const createdPrompts = await Promise.all(newStoryline.storylineParts.map(async (part) => {
        console.log("Processing Part:", part);
        // Find the corresponding feed item based on order
        const feedItem = dataFeed.find(item => item.order === part.order);
        console.log("Found Feed Item:", feedItem);

        // If there's a corresponding feed item, create the prompt data
        if (feedItem) {
            const promptData = {
                order: part.order,
                storyId: storyId,
                storylineId: storylineId,
                prompt: feedItem.prompt,
                twyneId: null, // or any specific value
                mediaType: part.mediaType, // Using mediaType from the storyline part
                promptTitle: feedItem.promptTitle,
                primers: feedItem.primers
            };
            console.log("Prompt Data:", promptData);
            return await promptModel.create(promptData);
        }
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
        // update each prompt with storylinepart id and media type



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