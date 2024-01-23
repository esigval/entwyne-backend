import express from 'express';
import dotenv from 'dotenv';
import editEngine from '../middleware/editingEngine/editEngine.js';
import assembleMainMediaFile from '../middleware/editingEngine/assembleMainMedia.js';
import StorylineModel from '../models/storylineModel.js';
import renderingOrder from '../middleware/editingEngine/renderingOrder.js';
dotenv.config();

const testFunction = async () => {
    try {
        const storylineId = '65a9b0e33570f0ef6d4a3ecc';
        const musicName = 'Hopeful.mp3';
        const coupleName = 'Evan & Katie';
        const marriageDate = '3/19/2024';
        const bucketName = 'twyne-renders';

        //const order = await editEngine(storylineId);
        const order = await renderingOrder(storylineId);
        const key = await assembleMainMediaFile(storylineId, coupleName, marriageDate, musicName, order);

        const getS3Url = (bucketName, key, region = 'us-east-1') => {
            return `https://${bucketName}.s3.${region}.amazonaws.com/${key}`;
        };

        const finalRender = getS3Url(bucketName, key);
        await StorylineModel.updateStorylineWithFinalRender(storylineId, finalRender);

        console.log('Test completed successfully');
    } catch (error) {
        console.error('Test failed:', error);
    }
};

testFunction();