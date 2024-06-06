import Prompts from '../../models/promptModel.js'; // Import the Prompts model
import calculatePromptProgress from './calculatePromptProgress.js';

const setPromptCollectedandStatus = async (req, res, next) => {
    try {
        const promptId = req.params.promptId;
        const progress = await calculatePromptProgress(promptId); // Calculate the progress of the prompt

        // Only set the collected status to true if the progress is 100% or more
        if (progress >= 1) {
            await Prompts.setCollectedStatus(promptId, true); // Pass the status to the function
        }

        await Prompts.setProgress(promptId, progress); // Pass the progress to the function
        next();
    } catch (error) {
        next(error);
    }
};

export default setPromptCollectedandStatus;