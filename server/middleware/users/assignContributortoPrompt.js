import { ObjectId } from 'mongodb';
import Prompt from '../../models/promptModel.js';
import User from '../../models/userModel.js';

export const assignContributorsMiddleware = async (req, res, next) => {
    const { promptId, contributors } = req.body;
    const { userId } = req;

    if (!promptId || !contributors) {
        return res.status(400).json({ message: 'Prompt ID and contributors are required' });
    }

    try {
        // Convert contributors to array of ObjectIds
        const contributorIds = contributors.map(id => new ObjectId(id));

        // Assign contributors to the prompt
        const result = await Prompt.assignContributorsByPromptId(promptId, userId, contributorIds);

        if (!result) {
            return res.status(404).json({ message: 'Prompt not found or contributors not assigned' });
        }
        await User.addConnection(userId, contributorIds);

        // Add the result to the response
        res.locals.result = result;

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};