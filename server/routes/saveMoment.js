import express from 'express';
import createPresignedUrl from '../middleware/presignedUrls/createPresignedUrl.js';
import saveMoment from '../middleware/saveMoment.js';
import { buckets } from '../config.js';
const router = express.Router();

router.get('/',
  async (req, res, next) => {
    const promptId = req.query.promptId; // Assume prompt ID is passed as a query parameter
    const videoUri = decodeURIComponent(req.query.videoUri); // Assume video URI is passed as a query parameter
    if (!promptId) {
      return res.status(400).send('Prompt ID is required');
    }

    try {
      const { presignedUrl, key } = await createPresignedUrl(buckets.EXTRACTION_BUCKET, promptId);
      console.log('presignedUrl:', presignedUrl); // Make sure presignedUrl is correct
      req.key = key; // Attach the key to the req object
      req.promptId = promptId; // Attach the promptId to the req object
      req.presignedUrl = presignedUrl; // Attach the presignedUrl to the req object
      req.videoUri = videoUri; // Attach the videoUri to the req object
      next(); // Call the next middleware function
    } catch (error) {
      console.error('Error generating pre-signed URL:', error);
      res.status(500).send('Internal Server Error');
    }
  },
  saveMoment, // saveMoment middleware runs next

  async (req, res) => { // Make this function async
    const presignedUrl = await req.presignedUrl;
    console.log('req.presignedUrl:', presignedUrl); // Make sure presignedUrl is correct
    console.log('newMomentId:', res.locals.newMomentId); // Access the new ObjectId from the res.locals object
    // Send response after saveMoment middleware has run
    res.json({ presignedUrl: presignedUrl, newMomentId: res.locals.newMomentId });
}
);

export default router;
