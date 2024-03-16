// userLogin.js
import express from 'express';
import { authMiddleware } from '../middleware/authentication/authMiddleware.js';

const router = express.Router();

router.post('/', authMiddleware, (req, res, next) => {
    const tokens = res.locals.tokens;
    const user = req.user;
    res.status(200).json({ message: 'LOGGED IN!', ...tokens, ...user });
}, (error, req, res, next) => {
    console.error(error); // Log the error details in the server console
    res.status(500).json({ message: 'An error occurred', error: error.message });
});

export default router;