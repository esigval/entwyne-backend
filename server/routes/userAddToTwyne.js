import express from 'express';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import assignCoCreatorsTwyneMiddleware from '../middleware/users/assignCoCreatorsToTwyne.js'; // Import the middleware

const router = express.Router();

// Use the middleware in the route
router.post('/', validateTokenMiddleware, assignCoCreatorsTwyneMiddleware, (req, res) => {
    const { userType } = req.body;
    res.json({ message: `${userType} User added successfully` });
});

export default router;