import express from 'express';
const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const collection = req.db.collection('prompts');
        const docs = await collection.find({}).toArray();
        res.json(docs);
    } catch (err) {
        console.error('Failed to get stories:', err);
        res.status(500).send('Error in getStories');
    }
});

export default router;


