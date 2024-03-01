import jwt from 'jsonwebtoken';
import User from '../../models/userModel.js'; // replace with your actual user model file
import { config, tokenExpiration } from '../../config.js';

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

export const handleRefreshTokenMiddleware = (req, res) => {
    const refreshToken = req.body.token;

    if (refreshToken == null) return res.sendStatus(401);

    // Verify the JWT first to get the user id
    jwt.verify(refreshToken, currentConfig.REFRESH_TOKEN_SECRET, async (err, user) => {
        if (err) return res.sendStatus(403);

        try {
            // Find the user and compare the refresh token
            await User.findUserAndCompareToken(user.id, refreshToken);

            // If the tokens match, sign a new access token
            const accessToken = jwt.sign({ id: user.id }, currentConfig.SESSION_SECRET, { expiresIn: tokenExpiration });
            res.json({ accessToken: accessToken });
        } catch (error) {
            // If the tokens don't match, send an error response
            res.status(403).json({ error: 'Invalid refresh token. You may need to reauthenticate.' });
        }
    });
};