import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js'; // Assuming you have a User model for MongoDB
import dotenv from 'dotenv';
import { config, tokenExpiration, refreshTokenExpiration } from '../config.js';

dotenv.config();

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const router = express.Router();

router.post('/', async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findByUsernameOrEmail(username);
        if (user) {
            // Compare submitted password with the stored hash
            const isMatch = await bcrypt.compare(password, user.password);
            if (isMatch) {
                const token = jwt.sign({ id: user._id }, currentConfig.SESSION_SECRET, { expiresIn: tokenExpiration });

                const refreshToken = jwt.sign({ id: user._id }, currentConfig.REFRESH_TOKEN_SECRET, { expiresIn: refreshTokenExpiration });
                res.status(200).json({ message: 'LOGGED IN!', token, refreshToken });
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