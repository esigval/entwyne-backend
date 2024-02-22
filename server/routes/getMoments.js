import express from 'express';
import Moment from '../models/momentModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
    try {
        const docs = await Moment.listAll();
        res.json(docs);
    } catch (err) {
        console.error('Failed to get moments:', err);
        res.status(500).send('Error in getMoments');
    }
});

export default router;

