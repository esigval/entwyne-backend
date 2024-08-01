import Moment from '../../models/momentModel.js';
import Prompts from '../../models/promptModel.js';
import Storyline from '../../models/storylineModel.js';

/**
 * Finds and replaces unprocessed moments in a storyline with valid ones.
 *
 * @param {string} storylineId - The ID of the storyline.
 * @param {Object[]} unprocessedMoments - The list of unprocessed moments.
 * @returns {Promise<void>}
 */
const findAlternativeValidMoments = async (storylineId, unprocessedMoments) => {
    const storyline = await Storyline.findById(storylineId);
    if (!storyline) {
        throw new Error(`No storyline found with ID ${storylineId}`);
    }

    let isModified = false;


    for (const unprocessed of unprocessedMoments) {
        const { partId, clipId, momentId } = unprocessed;
        const part = storyline.structure.find(p => `${p.part}_${p.order}` === partId);
        console.log(`Checking for alternative valid moments in storyline part ${JSON.stringify(part.promptId)}`);

        if (part) {
            const alternativeMoment = await findProcessedMomentFromSamePrompt(part.promptId);
            console.log(`Alternative moment for prompt ${part.promptId}: ${alternativeMoment}`);
            if (alternativeMoment) {
                const clip = part.clips.find(c => c.id === clipId);
                if (clip) {
                    clip.momentId = alternativeMoment._id;
                    isModified = true;
                    console.log(`Replaced moment ${momentId} with ${alternativeMoment._id} in storyline part ${partId}`);
                }
            }
        }
    }

    if (isModified) {
        await Storyline.updateStoryline(storylineId, storyline);
        console.log(`Storyline ${storylineId} has been updated.`);
    }
};

/**
 * Finds a processed moment from the same prompt.
 *
 * @param {string[]} promptIds - The list of prompt IDs.
 * @returns {Promise<Moment|null>} - Returns a processed moment or null.
 */
const findProcessedMomentFromSamePrompt = async (promptId) => {
    const prompt = await Prompts.findById(promptId);
    if (!prompt) {
        return null;
    }

    const momentsArray = await Moment.findMultipleByIds(prompt.momentId);
    return momentsArray.find(moment => moment.processed === true) || null;
};

export default findAlternativeValidMoments;
