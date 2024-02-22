import express from 'express';
import Prompts from '../models/promptModel.js';
import Moments from '../models/momentModel.js';
import StorylineModel from '../models/storylineModel.js';

const router = express.Router();


router.get('/', async (req, res) => {
    console.log('confirmMoment.js hit');


    const { promptId, newMomentId } = req.query;
    console.log('promptId', promptId);
    console.log('newMomentId', newMomentId);
    
    try {
        // get storylineId from Prompt
        const storylineId = await Prompts.getStorylineId(promptId);
        // save Moment to Prompt
        const saveMomentId = await Prompts.saveMomentToPrompt(promptId, newMomentId);
        // get Moment Urls 
        const momentUrls = await Moments.getMomentUrls(newMomentId);
        console.log('twnye Urls', momentUrls)
        // save Urls to Storyline Model
        const updatedStoryline = await StorylineModel.updateStorylinePartWithS3Url(storylineId, promptId, momentUrls.s3FilePath, momentUrls.s3Uri, newMomentId);
        console.log(storylineId);
        // Update Collection Status
        const collectedResult = await Prompts.setCollectedtoTrue(promptId);
        console.log(collectedResult);
        // Check if all prompts have been collected
        const result = await Prompts.checkPromptsCollected(storylineId);
        console.log(result);
        
        res.send(result);
    
    } catch (err) {
        console.error('Failed to get stories:', err);
        res.status(500).send('Error in getStories');
    }
});

export default router;


