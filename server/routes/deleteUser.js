import express from 'express';
import User from '../models/userModel.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js'; // Import the middleware

const router = express.Router();

router.delete('/:userId', validateTokenMiddleware, async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.userId);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;