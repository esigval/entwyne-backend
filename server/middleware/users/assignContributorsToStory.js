import Story from '../../models/storyModel.js';
import User from '../../models/userModel.js'; // Assuming the User model is correctly imported
import { ObjectId } from 'mongodb';
import validator from 'validator';

// Middleware for assigning Contributors to a Story

const assignContributorsToStoryMiddleware = async (req, res, next) => {
    try {
        const { contributors } = req.body;
        const storyId = req.storyId.toString(); // Convert ObjectId to string for validation
        console.log('req.storyId:', req.storyId);
        console.log('req.body:', req.body);

        // Validate storyId
        if (!validator.isMongoId(storyId)) {
            console.log('Invalid story ID');
            return res.status(400).send({ message: "Invalid story ID" });
        }

        // Process contributors to ensure they exist or create them as preUsers
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

        // Convert validContributorIds to ObjectId
        const addContributorsPromises = validContributorIds.map(id =>
            Story.addContributorToStory(id.toString(), storyId)
        );

        await Promise.all(addContributorsPromises);
        res.status(200).send({ message: "Contributors successfully assigned to the story" });
    } catch (error) {
        console.error("Error assigning contributors to story:", error);
        res.status(500).send({ message: "Failed to assign contributors to the story" });
    }
}

export default assignContributorsToStoryMiddleware;