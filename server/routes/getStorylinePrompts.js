import express from 'express';
import Prompts from '../models/promptModel.js'; // Make sure to import the Prompts class

const router = express.Router();

router.get('/:storylineId', async (req, res) => {
    try {
        const id = req.params.id;
        const fields = req.query.fields;
        const projection = fields ? fields.split(',').reduce((proj, field) => {
            proj[field.trim()] = 1; // Trim spaces and add field to projection
            return proj;
        }, { _id: 1, storylineId: 1, storyId: 1 }) : { _id: 1, storylineId: 1, storyId: 1 };

        const prompt = await Prompts.findByStorylineIdFlex(id, projection);
        res.json(prompt);
    } catch (err) {
        console.error('Failed to get prompts:', err);
        res.status(500).send('Error in getPrompts');
    }
});

export default router;