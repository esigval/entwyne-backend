
const dataFeed = [
    {
        "order": 1,
        "prompt": "Select an image that captures the essence of your love story's beginning or a defining theme of your relationship.",
        "promptTitle": "Define Beginning"
    },
    {
        "order": 2,
        "prompt": "Film your reflection on significant experiences that reveal the depth and uniqueness of your relationship with Katie.",
        "promptTitle": "Share Experiences"
    },
    {
        "order": 3,
        "prompt": "Choose an image that represents a pivotal moment of change or illustrates how you support each other through life's transitions.",
        "promptTitle": "Pivotal Moment"
    },
    {
        "order": 4,
        "prompt": "Record an anecdote where effective communication and idea clarification from Katie profoundly impacted your partnership.",
        "promptTitle": "Impactful Communication"
    },
    {
        "order": 5,
        "prompt": "Pick an image that symbolizes the continuity of your love story, bridging the gap between shared past experiences and future aspirations.",
        "promptTitle": "Story Continuity"
    },
    {
        "order": 6,
        "prompt": "Conclude with an image that captures the current joy and contentment in your relationship, or symbolizes your shared dreams.",
        "promptTitle": "Joyful Conclusion"
    }
]



import StorylineTemplate from '../models/storylineTemplateModel.js';
import StorylineModel from '../models/storylineModel.js';
import promptModel from '../models/promptModel.js';

const storyId = "6595c44b193a70b4f8e3fbb7"
const templateName = "What I Love About You"


async function createStorylineFromTemplate(templateName, storyId) {
    try {
        // Retrieve storyline parts based on the template name
        const storylineTemplateParts = await StorylineTemplate.getStorylineTemplateParts(templateName);
        if (!storylineTemplateParts) {
            throw new Error("No storyline parts found for the given template name.");
        }
        console.log("storylineTemplateParts:", storylineTemplateParts);

        // Prepare the data for the new storyline
        const storylineData = {
            StoryId: storyId,
            StorylineTemplateParts: storylineTemplateParts,
        };

        // Create the new storyline
        const newStoryline = await StorylineModel.create(storylineData);

        // Return the newly created storyline
        return newStoryline;
    } catch (error) {
        console.error("Error in createStorylineFromTemplate:", error);
        throw error;
    }
}


const createPromptAndStorylineObjects = async (dataFeed, storyId) => {
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
createPromptAndStorylineObjects(dataFeed, storyId)
    .then(result => {
        console.log(result);
    })
    .catch(error => {
        console.error(error);
    });
