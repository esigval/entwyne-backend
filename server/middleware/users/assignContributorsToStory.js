import Story from '../../models/storyModel.js';
import { ObjectId } from 'mongodb';
import validator from 'validator';

// Middleware for assigning Contributors to a Story

const assignContributorsToStoryMiddleware = async (req, res, next) => {
    try {
        const { contributors } = req.body;
        const storyId = req.storyId.toString(); // Convert ObjectId to string for validation
        console.log('req.storyId:', req.storyId);
        console.log('req.body:', req.body);

        // Validate storyId and contributors
        if (!validator.isMongoId(storyId) || !Array.isArray(contributors) || !contributors.every(id => validator.isMongoId(id))) {
            return res.status(400).send({ message: "Invalid story ID or contributor IDs" });
        }

        // Convert contributors to ObjectId
        const contributorObjectIds = contributors.map(id => new ObjectId(id));
        const addContributorsPromises = contributorObjectIds.map(id =>
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