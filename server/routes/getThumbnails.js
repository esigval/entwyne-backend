import express from 'express';
import Moments from '../models/momentModel.js';
import { validateTokenMiddleware } from '../middleware/authentication/validateTokenMiddleware.js'; // Import the middleware

const router = express.Router();

router.get('/', validateTokenMiddleware, async (req, res) => {
    console.log('getting thumbnails');

    const storylineId = req.query.storylineId;
    
    try {
        const pictureUris = await Moments.getpictureUribyStorylineId(storylineId, 4); // Get the first 4 pictureUris
        res.send({ pictureUris });
        console.log('Picture Moments Collected', pictureUris);

    } catch (err) {
        console.error('Failed Pictures:', err);
        res.status(500).send('Error in collect Pictures');
    }
});

export default router;
