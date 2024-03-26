import express from 'express';
import Moment from '../models/momentModel.js'; // Make sure this points to your Moment model file
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js'; // Import the middleware
import { ObjectId } from 'mongodb';

const router = express.Router();

router.patch('/:userId/:momentId', async (req, res) => {
    try {
        const userId = new ObjectId(req.params.userId); // Get the userId from the request params
        const momentId = new ObjectId(req.params.momentId); // Get the momentId from the request params
        const { transcription, stampedTranscription } = req.body; // Get the data to update from the request body

        // Update the moment in the database using the updateMoment method
        const updatedMoment = await Moment.updateMoment({ userId, momentId, update: { transcription, stampedTranscription } });
        console.log('updatedMoment:', updatedMoment);

        res.status(200).json({ message: 'Moment updated successfully', updatedMoment });
    } catch (error) {
        console.error('Error updating the moment:', error);
        res.status(500).send('Error updating the moment');
    }
});

export default router;