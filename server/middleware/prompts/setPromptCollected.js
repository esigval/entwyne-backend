import Prompts from '../../models/promptModel.js'; // Import the Prompts model

const setPromptCollected = async (req, res, next) => {
    const promptId = req.params.promptId;
    const status = req.params.status; // Get the status from the request body
    await Prompts.setCollectedStatus(promptId, status); // Pass the status to the function

    next();
};

export default setPromptCollected;