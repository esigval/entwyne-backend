import express from 'express';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
import { processTwyne } from '../middleware/renderEngine/processTwyne.js'; // Import the new function

const router = express.Router();

router.post('/:twyneId', validateTokenMiddleware, async (req, res) => {
    try {
        const userId = req.userId;
        const result = await processTwyne(req.params.twyneId, userId);
        
        if (result.status === 'error') {
            return res.status(500).json(result);
        }

        res.status(200).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing Twyne');
    }
});

export default router;