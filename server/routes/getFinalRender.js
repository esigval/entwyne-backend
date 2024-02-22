import express from 'express';
import StorylineModel from '../models/storylineModel.js';
import Moments from '../models/momentModel.js';

const router = express.Router();

router.get('/:storylineId', async (req, res) => {
    try {
        console.log('getFinalRender hit');
        const { storylineId } = req.params;
        const storyline = await StorylineModel.findFinalRender(storylineId);
        const finalRenderThumbnail = await Moments.getpictureUribyStorylineId(storylineId, 1);

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