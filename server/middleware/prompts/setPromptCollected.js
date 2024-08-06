import Prompts from '../../models/promptModel.js'; // Import the Prompts model
import calculatePromptProgress from './calculatePromptProgress.js';

const setPromptCollectedandStatus = async (req, res, next) => {
    try {
        const promptId = req.s3Keys.promptId;
        const { progressPercentage, storylineProgressPercentage } = await calculatePromptProgress(promptId); // Calculate the progress of the prompt

        // Determine and set the collected status based on the progress
        let status = "false"; // Default status
        if (progressPercentage >= 1) {
            status = "true"; // Progress is 100% or more
        } else if (progressPercentage > 0) {
            status = "inProgress"; // Progress is more than 0 but less than 100%
        }
        
        await Prompts.setCollectedStatus(promptId, status); // Pass the status to the function
        await Prompts.setProgress(promptId, progressPercentage); // Pass the progress to the function

        req.params.storylineProgressPercentage = storylineProgressPercentage;

        next();
    } catch (error) {
        next(error);
    }
};

export default setPromptCollectedandStatus;