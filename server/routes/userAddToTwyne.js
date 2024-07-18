import express from 'express';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import assignCoCreatorsTwyneMiddleware from '../middleware/users/assignCoCreatorsToTwyne.js'; // Import the middleware
import assignContributorsToStoryMiddleware from '../middleware/users/assignContributorsToStory.js';
import getStoryFromTwyneMiddleware from '../middleware/users/getStoryFromTwyne.js';

const router = express.Router();

// Use the middleware in the route
router.post('/', validateTokenMiddleware, assignCoCreatorsTwyneMiddleware, getStoryFromTwyneMiddleware, assignContributorsToStoryMiddleware, (req, res) => {
    const { userType } = req.body;
    res.json({ message: `${userType} User added successfully` });
});

export default router;