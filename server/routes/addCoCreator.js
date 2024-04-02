import express from 'express';
import User from '../models/userModel.js'; // Make sure this points to your new class file
import Story from '../models/storyModel.js'; // Make sure this points to your new class file
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js'; // Import the middleware
import { ObjectId } from 'mongodb';

const router = express.Router();

router.post('/', validateTokenMiddleware, async (req, res) => {
    try {
        console.log(req.body);
        const { storyId, coCreator } = req.body;
        console.log('storyId:', storyId);
        console.log('coCreator:', coCreator);
        const userId = req.userId;
        if (!storyId || !userId) {
            return res.status(400).json({ message: 'Both storyId and userId are required' });
        }

        const coCreatorId = new ObjectId(coCreator);
        const result = await Story.update(storyId, { $push: { coCreators: coCreatorId } });
        await User.addConnection(userId, coCreatorId);


        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'No story found with the provided storyId' });
        }

        res.status(200).json({ message: 'CoCreator added successfully' });
    } catch (error) {
        console.error('Error adding a coCreator:', error);
        res.status(500).send('Error adding a coCreator');
    }
});

export default router;