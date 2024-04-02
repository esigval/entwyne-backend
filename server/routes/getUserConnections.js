import express from 'express';
import User from '../models/userModel.js'; // Import the User model
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js'; // Import the middleware

const router = express.Router();

router.get('/', validateTokenMiddleware, async (req, res) => {
    try {
        const connection = await User.findConnections(req.userId);
        res.json(connection);
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
}); 

export default router;