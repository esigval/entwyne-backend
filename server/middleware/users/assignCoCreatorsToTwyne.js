import Twyne from '../../models/twyneModel.js';
import User from '../../models/userModel.js';
import { ObjectId } from 'mongodb';
import validator from 'validator';

// Middleware for assigning CoCreators or Contributors to a Twyne
const assignCoCreatorsTwyneMiddleware = async (req, res, next) => {
    console.log('req.userId:', req.userId);
    try {
        const { twyneId, contributors, userType } = req.body;
        if (!twyneId || !contributors || !userType) {
            return res.status(400).json({ message: 'twyneId, contributors, and userType are required' });
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

        // Add contributors to the Twyne
        let result;
        // Iterate over validContributorIds and add each as a coCreator or contributor
        for (const userId of validContributorIds) {
            if (userType === 'coCreator') {
                result = await Twyne.addNewCoCreator(twyneId, userId);
            } else if (userType === 'contributor') {
                result = await Twyne.addNewContributor(twyneId, userId);
            }
            // Handle result or error for each userId if necessary
        }

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Twyne not found' });
        }

        // Add userId to connections array in User document for each valid contributor
        await Promise.all(validContributorIds.map(async (contributorId) => {
            await User.addConnection(req.userId, contributorId);
        }));

        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export default assignCoCreatorsTwyneMiddleware;