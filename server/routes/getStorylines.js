import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const response = await StorylineModel.findStoryByStoryId(req.query.storyId);
        res.json(response._id);
    } catch (err) {
        console.error('Failed to get stories:', err);
        res.status(500).send('Error in getStories');
    }
});

export default router;


