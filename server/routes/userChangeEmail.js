import express from 'express';
import initiateEmailChange from '../services/initiateEmailChange.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';

const router = express.Router();

router.post('/', validateTokenMiddleware, async (req, res) => {
    console.log('Route hit. User ID:', req.userId);
    const { userId } = req; 
    const { newEmail } = req.body;
    try {
        await initiateEmailChange(userId, newEmail);
        res.status(202).json({ message: 'Verification email sent. Please check your new email to confirm the change.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
