import express from 'express';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js';
const router = express.Router();

router.get('/', validateTokenMiddleware, async (req, res) => {
    console.log('GET / route hit');
    try {
        const collection = req.db.collection('storylineTemplates');

        // Retrieve template names from query parameters or set a default
        const templateNames = req.query.templateNames ? req.query.templateNames.split(',') : [];

        // MongoDB query to find documents with templateName in the provided list
        const query = templateNames.length > 0 ? { templateName: { $in: templateNames } } : {};

        const docs = await collection.find(query).toArray();
        console.log(docs);

        // Create a new array that contains only the templateName of each document
        const templateNamesArray = docs.map(doc => doc.templateName);
        console.log(templateNamesArray);   

        res.json(templateNamesArray);
    } catch (err) {
        console.error('Failed to get stories:', err);
        res.status(500).send('Error in getStories');
    }
});

export default router;