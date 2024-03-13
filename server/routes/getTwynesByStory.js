import express from 'express';
import Twyne from '../models/twyneModel.js';

const router = express.Router();

router.get('/v1/twyne/story/:storyId', async (req, res) => {
    try {
        const twynes = await Twyne.listByStoryId(req.params.storyId);
        res.status(200).json(twynes);
    } catch (error) {
        res.status(500).json({ message: 'Error listing Twynes by Story ID' });
    }
});

export default router;