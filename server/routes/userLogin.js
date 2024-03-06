import express from 'express';
import { authMiddleware } from '../middleware/authentication/authMiddleware.js'; // replace '../server/middleware/authentication/authMiddleware' with the path to your

const router = express.Router();

router.post('/', authMiddleware, (req, res) => {
    const tokens = res.locals.tokens;
    const user = req.user;
    res.status(200).json({ message: 'LOGGED IN!', ...tokens, ...user });
});

export default router;