import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { config } from '../config.js';


const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const router = express.Router();

router.post('/', async (req, res) => {
    const { newPassword, token } = req.body;
    try {
        const decoded = jwt.verify(token, currentConfig.PASSWORD_SECRET);
        console.log('Decoded:', decoded);
        const { userId } = decoded;

        // Proceed to update the email address in the database
        await User.deletePasswordAndReplaceWithHash(userId, newPassword);

        res.send('Email updated successfully.');
    } catch (error) {
        // Handle expired token or other errors
        res.status(400).send('Invalid or expired token.');
    }
});

export default router;