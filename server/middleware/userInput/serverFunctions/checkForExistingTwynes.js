import Twyne from '../../../models/twyneModel.js';

export const checkForExistingTwynes = async (storyId) => {
    const twyne = await Twyne.findByStoryId(storyId);
    return twyne !== null;
}