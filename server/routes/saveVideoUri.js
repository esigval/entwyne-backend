import express from 'express';
import { connect } from '../db/db.js';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { videoUri } = req.body;
        const db = await connect();
        const collection = db.collection('twynes');
        await collection.insertOne({ videoUri });
        res.status(200).send({ message: 'Video URI saved successfully.' });
    } catch (err) {
        console.error('Failed to save videoUri:', err);
        res.status(500).send('Error in saveVideoUri');
    }
});

export default router