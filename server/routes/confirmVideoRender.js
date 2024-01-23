import express from 'express';
import dotenv from 'dotenv';
import editEngine from '../middleware/editingEngine/editEngine.js';
import assembleMainMediaFile from '../middleware/editingEngine/assembleMainMedia.js';
import StorylineModel from '../models/storylineModel.js';
dotenv.config();

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { storylineId, musicName, coupleName, marriageDate } = req.body;
    console.log('storylineId', storylineId);

    const order = await editEngine(storylineId);
    const key = await assembleMainMediaFile(storylineId, coupleName, marriageDate, musicName, order);
    const bucketName = 'twyne-renders';
    const getS3Url = (bucketName, key, region = 'us-east-1') => {
        return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
    };
    const finalRender = getS3Url(bucketName, key);
    await StorylineModel.updateStorylineWithFinalRender(storylineId, finalRender);

  } catch (error) {
    console.error(error);
    res.status(500).send(error);
  }
});

export default router;