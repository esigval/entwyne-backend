import express from 'express';
import Prompts from '../models/promptModel.js'; // Make sure to import the Prompts class

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const prompts = await Prompts.findAll();
        res.json(prompts);
    } catch (err) {
        console.error('Failed to get prompts:', err);
        res.status(500).send('Error in getPrompts');
    }
});

export default router;