import Prompts from '../../models/promptModel.js'; // Import the Prompts model

const setPromptCollected = async (req, res, next) => {
    const promptId = req.params.promptId;
    await Prompts.setCollectedtoTrue(promptId);

    next();
};

export default setPromptCollected;