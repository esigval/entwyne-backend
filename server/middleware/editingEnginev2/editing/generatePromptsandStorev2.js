import Prompts from "../../../models/promptModel.js";
import { ObjectId } from 'mongodb';

const generatePromptsAndAssociateWithClips = async (twyneId, storyId, storylineId, userId, storylineInstance) => {
    const promptClipAssociations = [];
    const prompts = storylineInstance.structure.flatMap((block, index) =>
        block.clips.map((clip) => {
            // Prepare the prompt data for insertion
            const promptData = {
                order: block.order,
                twyneId: new ObjectId(twyneId), // Ensure twyneId is valid ObjectId
                storylineId: new ObjectId(storylineId), // Ensure storylineId is valid ObjectId
                storyId: new ObjectId(storyId), // Ensure storyId is valid ObjectId
                prompt: clip.prompt,
                mediaType: clip.type,
                promptTitle: block.part, // Assuming 'part' as the title
                collected: false,
                userId: new ObjectId(userId), // Convert to ObjectId
                createdAt: new Date(),
                lastUpdated: new Date(),
            };
            // Keep track of the clip ID for later association with its promptId
            promptClipAssociations.push({ clipId: clip.id });
            return promptData;
        })
    );

    // Insert prompts and assume the function returns the inserted prompts with their IDs
    const insertedPromptIds = await Prompts.insertMany(prompts);

    // Associate promptIds with the corresponding clipIds
    insertedPromptIds.forEach((promptId, index) => {
        if (promptClipAssociations[index]) { // Ensure there's a corresponding clip association
            promptClipAssociations[index].promptId = new ObjectId(promptId); // Convert ObjectId to string if needed
        }
    });
    return promptClipAssociations;
};

const updateStorylineWithPromptIds = (storylineInstance, promptClipAssociations) => {
    storylineInstance.structure.forEach((block) => {
        block.clips.forEach((clip) => {
            // Find the association for this clip
            const association = promptClipAssociations.find(assoc => assoc.clipId === clip.id);
            if (association) {
                // Update the clip with its promptId
                clip.promptId = new ObjectId(association.promptId);
            }
        });
    });
};

const generateAndStorePrompts = async (twyneId, storyId, storylineId, userId, storylineInstance) => {
    try {
        // Generate prompts and associate with clips
        const promptClipAssociations = await generatePromptsAndAssociateWithClips(twyneId, storyId, storylineId, userId, storylineInstance);

        // Update storylineInstance with promptIds
        updateStorylineWithPromptIds(storylineInstance, promptClipAssociations);

        // At this point, storylineInstance has been updated with promptIds
        // Proceed to save/update the storylineInstance in your database

        return storylineInstance;
    } catch (error) {
        console.error("Error during the prompt generation and storage process:", error);
    }
};

export default generateAndStorePrompts;

// Simulated function call
// Assume the ids are provided and valid, and narrativeClips is loaded with the structure similar to the one described
// const updatedStorylineInstance = await generateAndStorePrompts('65f13b5b3c54a131c18aed0a', '65e8f8ee5044800bdf5e840a', '661725d87d971fe6ab48f089', '660d81337b0c94b81b3f1744', narrativeClips);


// console.log(JSON.stringify(updatedStorylineInstance, null, 2));
