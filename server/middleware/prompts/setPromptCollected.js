import Prompts from '../../models/promptModel.js'; // Import the Prompts model
import calculatePromptProgress from './calculatePromptProgress.js';

const setPromptCollectedandStatus = async (req, res, next) => {
    try {
        const promptId = req.params.promptId;
        const progress = await calculatePromptProgress(promptId); // Calculate the progress of the prompt

        // Determine and set the collected status based on the progress
        let status = "false"; // Default status
        if (progress >= 1) {
            status = "true"; // Progress is 100% or more
        } else if (progress > 0) {
            status = "inProgress"; // Progress is more than 0 but less than 100%
        }
        await Prompts.setCollectedStatus(promptId, status); // Pass the status to the function

        await Prompts.setProgress(promptId, progress); // Pass the progress to the function
        next();
    } catch (error) {
        next(error);
    }
};

export default setPromptCollectedandStatus;