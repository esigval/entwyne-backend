// routes/twynes.js
import express from 'express';
import Twyne from '../models/twyneModel.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import { enrichTwynesMiddleware } from '../middleware/users/getContributorInfo.js';

const router = express.Router();

router.get('/', validateTokenMiddleware, async (req, res, next) => {
    console.log('GET /twynes');
    try {
        const userId = req.userId;
        
        let twynes = await Twyne.listUserTwynes(userId); // Use the provided method to fetch Twynes by storyId
        req.twynes = twynes; // Store twynes in the request object for the middleware to access

        next(); // Pass control to the enrichTwynesMiddleware
    } catch (error) {
        console.error('Error fetching Twynes by story ID:', error);
        res.status(500).json({ message: 'Error fetching Twynes by story ID' });
    }
}, enrichTwynesMiddleware, (req, res) => {
    res.status(200).json(req.twynes); // Send the enriched twynes
});

export default router;
