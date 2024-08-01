import videoRenderPayload from './utils/videoRenderPayloadConfig.js';
import renderVideo from './narrativeBlockHandler.js';

/**
 * Processes the Twyne by organizing the payload and rendering the video.
 *
 * @param {string} twyneId - The ID of the Twyne.
 * @param {string} userId - The ID of the user.
 * @returns {Promise<Object>} - The result of the video rendering process.
 */
export async function processTwyne(twyneId, userId) {
    try {
        const jsonConfig = await videoRenderPayload(twyneId);
        console.log('Rendering Twyne with config:', JSON.stringify(jsonConfig, null, 2));
        const result = await renderVideo(jsonConfig, userId);
        return result;
    } catch (error) {
        console.error('Error processing Twyne:', error);
        throw error;
    }
}