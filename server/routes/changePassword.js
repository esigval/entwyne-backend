import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js'; 
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';

const router = express.Router();

router.post('/', validateTokenMiddleware, async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    const userId = req.userId;

    // Fetch the user from the database
    const user = await User.findById(userId);
    if (!user) {
        console.log('User not found with ID:', userId);
        return res.status(404).json({ message: 'User not found' });
    }

    // Verify the current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
        console.log('Current password is incorrect for user ID:', userId);
        return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Hash the new password and update it in the database
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, { password: hashedPassword });

    console.log('Password updated successfully for user ID:', userId);
    res.status(200).json({ message: 'Password updated successfully' });
});

export default router;