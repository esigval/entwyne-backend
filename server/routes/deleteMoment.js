import express from 'express';
import { ObjectId } from 'mongodb';
import Moment from '../models/momentModel.js';

const router = express.Router();

router.delete('/deleteMoment/:id', async (req, res) => {

  try {
    const momentId = req.params.id;
    const result = await Moment.deleteOne(momentId);
    if (result.deletedCount === 1) {
        res.status(200).json({ message: 'Successfully deleted moment.' });
    } else {
        res.status(404).json({ message: 'Moment not found.' });
    }
} catch (error) {
    console.error("Error in DELETE /moment/:id:", error);
    res.status(500).json({ message: 'Internal server error.' });
}
});

export default router;