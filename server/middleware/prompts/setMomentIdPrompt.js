import Prompts from '../../models/promptModel.js'; // Import the Prompts model

const saveMomentToPrompt = async (req, res, next) => {
    const promptId = req.params.promptId; // Assuming the promptId is in req.s3Keys
    const momentId = req.s3Keys.momentId; // Assuming the momentId is in req.s3Keys
    await Prompts.saveMomentToPrompt(promptId, momentId);

    next();
};

export default saveMomentToPrompt;