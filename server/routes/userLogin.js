import express from 'express';
import bcrypt from 'bcrypt';
import User from '../models/userModel.js'; // Assuming you have a User model for MongoDB

const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;
    console.log('Username:', username);
    console.log('Password:', password);

    try {
        const user = await User.findByUsernameOrEmail(username);
        console.log('User:', user);
        if (user) {
            // Compare submitted password with the stored hash
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                // Placeholder for step 3 - Session or Token management
                res.status(200).json({ message: 'LOGGED IN!' });
            } else {
                res.status(400).json({ message: 'Invalid credentials' });
            }
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
