import express from 'express';
import Twynes from '../models/twyneModel.js';

const router = express.Router();

router.get('/', async (req, res) => {
    console.log('getting thumbnails');

    const storylineId = req.query.storylineId;
    
    try {
        const pictureUris = await Twynes.getpictureUribyStorylineId(storylineId, 4); // Get the first 4 pictureUris
        res.send({ pictureUris });
        console.log('Picture Twynes Collected', pictureUris);

    } catch (err) {
        console.error('Failed Pictures:', err);
        res.status(500).send('Error in collect Pictures');
    }
});

export default router;
