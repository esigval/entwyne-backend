import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js';
import { config, tokenExpiration } from '../../config.js';

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

export const authMiddleware = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findByUsernameOrEmail(username);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // If the credentials are valid, sign a new access token and refresh token
        const accessToken = jwt.sign({ id: user._id }, currentConfig.SESSION_SECRET, { expiresIn: tokenExpiration });
        const refreshToken = jwt.sign({ id: user._id }, currentConfig.REFRESH_TOKEN_SECRET);

        // Store the refresh token in the user document
        await User.findUserIdAndUpdateTokenStatus(user._id, refreshToken);

        // Add the tokens to the response
        res.locals.tokens = { accessToken, refreshToken };

        req.user = user;
        delete req.user.password;
        delete req.user.refreshToken;
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
        next(error);
    }
};