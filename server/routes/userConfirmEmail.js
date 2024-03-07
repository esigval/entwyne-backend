import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import { config } from '../config.js';


const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const router = express.Router();

router.get('/:token', async (req, res) => {
    const { token } = req.params;
    try {
        const decoded = jwt.verify(token, currentConfig.EMAIL_CONFIRMATION_SECRET);
        const { userId, newEmail } = decoded;

        // Proceed to update the email address in the database
        await User.findByIdAndUpdate(userId, { email: newEmail });

        res.send('Email updated successfully.');
    } catch (error) {
        // Handle expired token or other errors
        res.status(400).send('Invalid or expired token.');
    }
});

export default router;