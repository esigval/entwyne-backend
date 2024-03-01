import express from 'express';
import Prompts from '../models/promptModel.js'; // Assuming the model is exported from this path
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
const router = express.Router();

router.get('/:storyId', validateTokenMiddleware, async (req, res) => {
    try {
        const storyId = req.params.storyId;
        const primers = await Prompts.getPrimersFromPrompts(storyId);
        res.json(primers);
    } catch (err) {
        console.error('Failed to get primers:', err);
        res.status(500).send('Error in getPrimers');
    }
});

export default router;