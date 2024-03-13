import express from 'express';
import Moment from '../models/momentModel.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js'; // Import the middleware

const router = express.Router();

router.get('/', validateTokenMiddleware, async (req, res) => {
    const userId = req.userId;
    try {
        const docs = await Moment.listAllByUserId(userId);
        res.json(docs);
    } catch (err) {
        console.error('Failed to get moments:', err);
        res.status(500).send('Error in getMoments');
    }
});

export default router;