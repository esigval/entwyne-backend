import assembleMainMediaLambda from './assembleMainMediaLambda.js';
import getAssets from './getAssetsLambda.js';

// Set the path to the FFmpeg binary included in your deployment package

export const handler = async (event) => {
    try {
        const storylineId = event.storylineId;
        const titleDetails = JSON.parse(event.titleDetails);
        console.log('titleDetails', titleDetails);
        const orderDetails = event.orderDetails;
        
        await getAssets(storylineId, titleDetails.musicName);
        await assembleMainMediaLambda(storylineId, titleDetails, orderDetails);
    } catch (error) {
        console.error(error);
        throw error;
    }
};