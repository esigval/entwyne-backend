import express from 'express';
import Moment from '../models/momentModel.js';

const router = express.Router();

router.delete('/:id', async (req, res) => {
    try {
        const momentId = req.params.id;
        const userId = req.userId; // Get the userId from the request

        const result = await Moment.deleteOne(momentId, userId);
        if (result.status === 200) {
            res.status(200).json({ message: result.message });
        } else {
            res.status(result.status).json({ message: result.message });
        }
    } catch (error) {
        console.error("Error in DELETE /moment/:id:", error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

export default router;