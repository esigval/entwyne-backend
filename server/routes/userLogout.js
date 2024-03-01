import express from 'express';
import { logoutMiddleware } from '../middleware/authentication/logoutMiddleware.js';

import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
const router = express.Router();

router.post('/', validateTokenMiddleware, logoutMiddleware, (req, res) => {
    res.sendStatus(204);
});

export default router;