import express from 'express';
import StorylineModel from '../models/storylineModel.js';
import Twynes from '../models/twyneModel.js';

const router = express.Router();

router.get('/:storylineId', async (req, res) => {
    try {
        console.log('getFinalRender hit');
        const { storylineId } = req.params;
        const storyline = await StorylineModel.findFinalRender(storylineId);
        const finalRenderThumbnail = await Twynes.getpictureUribyStorylineId(storylineId, 1);

        if (!storyline || !storyline.finalRender) {
            return res.status(404).send({ message: 'Video not found' });
        }

        res.send({ url: storyline.finalRender, thumbnailUrl: finalRenderThumbnail });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
});

export default router;