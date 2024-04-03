import { ObjectId } from 'mongodb';
import Prompt from '../../models/promptModel.js';
import User from '../../models/userModel.js';
import validator from 'validator';

export const assignContributorsMiddleware = async (req, res, next) => {
    const { promptId, contributors } = req.body;
    const { userId } = req;

    if (!promptId || !contributors) {
        return res.status(400).json({ message: 'Prompt ID and contributors are required.' });
    }

    try {
        const contributorIds = await Promise.all(contributors.map(async (contributor) => {
            try {
                let user;
                // Normalize and validate contributor input.
                if (validator.isEmail(contributor)) {
                    const email = contributor.trim().toLowerCase();
                    user = await User.findByEmail(email);
                    if (!user) {
                        user = await User.create({ email, roles: ['preUser'] });
                        console.log(`User created with email ${email}:`, user);
                    } else {
                        console.log(`User already exists with email ${email}.`);
                    }
                } else if (ObjectId.isValid(contributor)) {
                    user = await User.findById(contributor);
                } else {
                    console.error(`Invalid contributor identifier: ${contributor}`);
                    return null;
                }
                // Return user's ObjectId if user exists or was created.
                return user ? new ObjectId(user._id) : null;
            } catch (error) {
                console.error(`Error processing contributor ${contributor}: ${error.message}`);
                return null;
            }
        }));

        // Filter out any null values that may have been added due to errors.
        const validContributorIds = contributorIds.filter(id => id !== null);
        if (validContributorIds.length === 0) {
            return res.status(404).json({ message: 'No valid contributors found.' });
        }

        // Assign contributors to the prompt and update user connections.
        const result = await Prompt.assignContributorsByPromptId(promptId, userId, validContributorIds);
        if (!result) {
            return res.status(404).json({ message: 'Prompt not found or contributors not assigned.' });
        }

        await User.addConnection(userId, validContributorIds);
        res.locals.result = result;

        next();
    } catch (error) {
        res.status(500).json({ message: `Server error: ${error.message}` });
    }
};
