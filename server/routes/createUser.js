import express from 'express';
import { createUserMiddleware } from '../middleware/authentication/createUserMiddleware.js';
import { firstLoginMiddleware } from '../middleware/authentication/firstLoginMiddleware.js';

const router = express.Router();

router.post('/', createUserMiddleware, firstLoginMiddleware, (req, res) => {
    try {
        // The user data and tokens are now attached to the req object
        const { user, token, refreshToken } = req;

        // Exclude the password from the response
        const { password: _, ...userDataWithoutPassword } = user;

        res.status(201).json({ ...userDataWithoutPassword, token, refreshToken });
    } catch (error) {
        console.log('Error:', error);
        res.status(500).json({ message: error.message });
    }
});

export default router;