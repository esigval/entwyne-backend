import express from 'express';
import Prompts from '../models/promptModel.js'; // Replace with actual path to your Prompts class

const router = express.Router();

// Route to get prompts by storyId and mediaType
router.get('/', async (req, res) => {
    try {
        const { storyId, mediaType } = req.query;

        // Validate the parameters
        if (!storyId || !mediaType) {
            return res.status(400).send('Missing storyId or mediaType parameter');
        }

        // Call the method to get the prompts
        const prompts = await Prompts.findByStoryIdAndMediaType(storyId, mediaType);

        // Return the prompts
        res.json(prompts);
    } catch (err) {
        console.error('Error in getting prompts:', err);
        res.status(500).send('Error in getting prompts');
    }
});

export default router;
