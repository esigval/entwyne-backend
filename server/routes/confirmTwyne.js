import express from 'express';
import Prompts from '../models/promptModel.js';

const router = express.Router();


router.get('/', async (req, res) => {
    console.log('confirmTwyne.js hit');


    const { promptId } = req.query;
    console.log('promptId', promptId);
    
    try {

        const storylineId = await Prompts.getStorylineId(promptId);
        console.log(storylineId);
        const collectedResult = await Prompts.setCollectedtoTrue(promptId);
        console.log(collectedResult);
        const result = await Prompts.checkPromptsCollected(storylineId);
        console.log(result);
        
        res.send(result);
    
    } catch (err) {
        console.error('Failed to get stories:', err);
        res.status(500).send('Error in getStories');
    }
});

export default router;


