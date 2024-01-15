import express from 'express';
import Prompts from '../models/promptModel.js';
import Twynes from '../models/twyneModel.js';
import StorylineModel from '../models/storylineModel.js';

const router = express.Router();


router.get('/', async (req, res) => {
    console.log('confirmTwyne.js hit');


    const { promptId, newTwyneId } = req.query;
    console.log('promptId', promptId);
    console.log('newTwyneId', newTwyneId);
    
    try {
        // get storylineId from Prompt
        const storylineId = await Prompts.getStorylineId(promptId);
        // save Twyne to Prompt
        const saveTwyneId = await Prompts.saveTwyneToPrompt(promptId, newTwyneId);
        // get Twyne Urls 
        const twyneUrls = await Twynes.getTwyneUrls(newTwyneId);
        console.log('twnye Urls', twyneUrls)
        // save Urls to Storyline Model
        const updatedStoryline = await StorylineModel.updateStorylinePartWithS3Url(storylineId, promptId, twyneUrls.s3FilePath, twyneUrls.s3Uri, newTwyneId);
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


