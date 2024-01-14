import express from 'express';
import Prompts from '../models/promptModel.js';

const router = express.Router();


router.get('/', async (req, res) => {
    console.log('checking prompt loading');

    const { storyId, mediaType } = req.query;
    console.log('storyId:', storyId, 'mediaType:', mediaType);
    
    try {

        const result = await Prompts.checkByStoryIdAndMediaType(storyId, mediaType);
        console.log(result);
        
        res.send(result);
    
    } catch (err) {
        console.error('Failed to get stories:', err);
        res.status(500).send('Error in getStories');
    }
});

export default router;

