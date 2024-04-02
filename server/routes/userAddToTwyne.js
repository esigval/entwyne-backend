import express from 'express';
import Twyne from '../models/twyneModel.js';
import User from '../models/userModel.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js'; // Import the middleware

const router = express.Router();

router.post('/', validateTokenMiddleware, async (req, res) => {
    console.log('req.userId:', req.userId);
    try {
        const { twyneId, userId, userType } = req.body;
        if (!twyneId || !userId || !userType) {
            return res.status(400).json({ message: 'twyneId, userId, and userType are required' });
        }

        let result;
        if (userType === 'coCreator') {
            result = await Twyne.addNewCoCreator(twyneId, userId);
        } else if (userType === 'contributor') {
            result = await Twyne.addNewContributor(twyneId, userId);
        } else {
            return res.status(400).json({ message: 'Invalid userType. Expected "CoCreator" or "Contributor".' });
        }

        if (result.modifiedCount === 0) {
            return res.status(404).json({ message: 'Twyne not found' });
        }

        // Add userId to connections array in User document
        const userResult = await User.addConnection(req.userId, userId);
        if (userResult.modifiedCount === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ message: `${userType} User added successfully` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
export default router;