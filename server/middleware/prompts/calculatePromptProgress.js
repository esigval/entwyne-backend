import Storyline from '../../models/storylineModel.js';
import Prompts from '../../models/promptModel.js';
import { ObjectId } from 'mongodb';

/**
 * Calculates the progress percentage for a given prompt in a storyline.
 *
 * @param {string} promptId - The ID of the prompt.
 * @param {string} storylineId - The ID of the storyline.
 * @returns {Promise<number>} - The progress percentage, as a number between 0 and 100.
 */

async function calculatePromptProgress(promptId) {
    // Convert promptId to ObjectId
    const promptObjectId = new ObjectId(promptId);

    const storylineId = await Prompts.getStorylineId(promptObjectId);
    console.log(storylineId);

    // Fetch the storyline from the database
    const storyline = await Storyline.findById(storylineId);
    console.log(storyline);

    // Find the structure item that contains the prompt
    const structureItem = storyline.structure.find(item => item.promptId.equals(promptObjectId));

    if (!structureItem) {
        throw new Error(`No structure item found for promptId ${promptId} in storylineId ${storylineId}`);
    }

    // Calculate the total number of clips
    const totalClips = structureItem.clips.length;

    // Calculate the progress percentage
    const progressPercentage = (totalClips / structureItem.clipPace.quantity);

    return progressPercentage;
}


export default calculatePromptProgress;
