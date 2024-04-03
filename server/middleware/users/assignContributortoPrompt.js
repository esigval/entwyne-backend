import { ObjectId } from 'mongodb';
import Prompt from '../../models/promptModel.js';
import User from '../../models/userModel.js';
import validator from 'validator';

// This script assigns a contributor or list of contributors to a prompt
// If the contributor is not found in the database, it creates a new user with the email address
// It also adds a connection between the user who assigned the contributor and the new contributor

export const assignContributorsMiddleware = async (req, res, next) => {
    const { promptId, contributors } = req.body;
    const { userId } = req;

    console.log('Prompt ID:', promptId);
    console.log('Contributors:', contributors);

    if (!promptId || !contributors) {
        return res.status(400).json({ message: 'Prompt ID and contributors are required' });
    }

    try {
        const contributorPromises = contributors.map(async (contributor) => {
            try {
                let user;
                if (validator.isEmail(contributor)) {
                    user = await User.findByEmail(contributor.trim().toLowerCase()); // Ensure case-insensitivity and trim spaces
                    if (!user) {
                        try {
                            user = await User.create({ email: contributor, roles: ['preUser'] });
                            console.log(`User created with email ${contributor}:`, user);
                        } catch (error) {
                            if (error.message.includes('Username or email already exists')) {
                                console.log(`User already exists with email ${contributor}. Skipping creation.`);
                                user = await User.findByEmail(contributor.trim().toLowerCase());
                            } else {
                                throw error; // Rethrow if a different error
                            }
                        }
                    }
                } else {
                    user = await User.findById(contributor);
                }
                return user ? new ObjectId(user._id) : null;
            } catch (error) {
                console.error(`Failed to process contributor ${contributor}: ${error.message}`);
                return null; // Return null to filter out this contributor later
            }
        });

        const contributorIds = (await Promise.all(contributorPromises)).filter(id => id !== null);

        if (contributorIds.length === 0) {
            return res.status(404).json({ message: 'No valid contributors found' });
        }

        const result = await Prompt.assignContributorsByPromptId(promptId, userId, contributorIds);
        if (!result) {
            return res.status(404).json({ message: 'Prompt not found or contributors not assigned' });
        }

        await User.addConnection(userId, contributorIds);
        res.locals.result = result;

        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
