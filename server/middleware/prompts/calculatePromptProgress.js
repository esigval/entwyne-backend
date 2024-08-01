import Storyline from '../../models/storylineModel.js';
import Prompts from '../../models/promptModel.js';
import storylineProgress from '../storyline/storylineProgress.js';
import { ObjectId } from 'mongodb';

/**
 * Calculates the progress percentage for a given prompt in a storyline.
 *
 * @param {string} promptId - The ID of the prompt.
 * @returns {Promise<{ progressPercentage: number, storylineProgressPercentage: number }>} - An object containing the progress percentage and storyline progress percentage.
 */
async function calculatePromptProgress(promptId) {
    // Convert promptId to ObjectId
    const promptObjectId = new ObjectId(promptId);

    const storylineId = await Prompts.getStorylineId(promptObjectId);

    // Fetch the storyline from the database
    const storyline = await Storyline.findById(storylineId);

    // Find the structure item that contains the prompt
    const structureItem = storyline.structure.find(item => item.promptId.equals(promptObjectId));

    if (!structureItem) {
        throw new Error(`No structure item found for promptId ${promptId} in storylineId ${storylineId}`);
    }

    // Calculate the total number of clips
    const totalClips = structureItem.clips.length;

    // Calculate the progress percentage
    const progressPercentage = (totalClips / structureItem.clipPace.quantity) * 100;

    // Update the progress field in the structure item
    structureItem.progress = progressPercentage;

    // Update the storyline object in the database
    const modifiedCount = await Storyline.updateStoryline(storylineId, storyline);

    const storylineProgressPercentage = await storylineProgress(storylineId);

    console.log(`Updated storyline ${storylineId} with modified count:`, modifiedCount, storylineProgressPercentage);

    return { progressPercentage, storylineProgressPercentage };
}

export default calculatePromptProgress;