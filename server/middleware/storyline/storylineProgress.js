import Storyline from '../../models/storylineModel.js';

/**
 * Calculates the progress percentage for a storyline based on its structure parts' progress.
 *
 * @param {string} storylineId - The ID of the storyline.
 * @returns {Promise<number>} - The progress percentage.
 */
async function calculateStorylineProgress(storylineId) {
    // Fetch the storyline from the database
    const storyline = await Storyline.findById(storylineId);

    if (!storyline) {
        throw new Error(`No storyline found with ID ${storylineId}`);
    }

    // Calculate the progress for each structure part
    storyline.structure.forEach(part => {
        const totalClips = part.clips.length;
        part.progress = (totalClips / part.clipPace.quantity) * 100;
    });

    // Calculate the total number of completed parts and total structure parts
    let completedParts = 0;
    const totalStructureParts = storyline.structure.length;

    storyline.structure.forEach(part => {
        if (part.progress >= 100) {
            completedParts += 1;
        }
    });

    // Calculate the overall progress percentage
    const progressPercentage = (completedParts / totalStructureParts) * 100;

    // Update the progress field at the top level of the storyline object
    storyline.progress = progressPercentage;

    // Update the storyline object in the database
    const modifiedCount = await Storyline.updateStoryline(storylineId, storyline);

    return progressPercentage;
}

export default calculateStorylineProgress;