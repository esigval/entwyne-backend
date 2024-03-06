import express from 'express';
import User from '../models/userModel.js';

const router = express.Router();

router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        delete user.password; // delete the password field
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;