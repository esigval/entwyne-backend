import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';
import { config } from '../../config.js';

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

export const logoutMiddleware = async (req, res) => {
    const userId = req.userId;

    if (!userId) return res.sendStatus(401); // No userId provided

    try {
        // Invalidate the token by removing it or marking it in the database
        await User.deleteRefreshToken(userId);
        res.sendStatus(204); // Successfully logged out
    } catch (error) {
        res.status(500).json({ error: 'Failed to logout' });
    }
};
