import express from 'express';
import StorylineModel from '../models/storylineModel.js';
import Moments from '../models/momentModel.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';


const router = express.Router();

router.get('/:storylineId', validateTokenMiddleware, async (req, res) => {
    try {
        const { storylineId } = req.params;
        let storyline = await StorylineModel.findFinalRender(storylineId);

        while (!storyline || !storyline.finalRender) {
            console.log('Video not found, checking again...');
            await new Promise(resolve => setTimeout(resolve, 5000)); // wait for 5 seconds before checking again
            storyline = await StorylineModel.findFinalRender(storylineId);
        }

        res.send({ status: 'complete' });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: 'Server error' });
    }
});
  
  export default router;