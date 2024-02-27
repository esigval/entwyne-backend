import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { config } from '../config.js';

dotenv.config();

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

const router = express.Router();

router.post('/', async (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    jwt.verify(refreshToken, currentConfig.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = jwt.sign({ id: user.id }, currentConfig.SESSION_SECRET, { expiresIn: '1h' });
        res.json({ accessToken: accessToken });
    });
});

export default router;