import express from 'express';
import User from '../models/userModel.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js'; // Import the middleware

const router = express.Router();

router.patch('/:userId', validateTokenMiddleware, async (req, res) => {
    console.log('Route hit. User ID:', req.params.userId);
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });
        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        delete updatedUser.password; // delete the password field
        res.json(updatedUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;