import jwt from 'jsonwebtoken';
import { config, tokenExpiration } from '../../config.js';

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

export const handleRefreshTokenMiddleware = (req, res) => {
    const refreshToken = req.body.token;

    if (refreshToken == null) return res.sendStatus(401);
    jwt.verify(refreshToken, currentConfig.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = jwt.sign({ id: user.id }, currentConfig.SESSION_SECRET, {  expiresIn: tokenExpiration });
        res.json({ accessToken: accessToken });
    });

};