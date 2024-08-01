import Twyne from '../../../models/twyneModel.js'; 
import Storyline from '../../../models/storylineModel.js';
import Story from '../../../models/storyModel.js'; 

/**
 * Fetches data from the database and constructs the JSON payload.
 *
 * @param {string} twyneId - The ID of the twyne.
 * @returns {Promise<Object>} - The constructed JSON payload.
 */


async function videoRenderPayload(twyneId) {
    try {
        // Fetch twyne details from the database
        const twyne = await Twyne.findById(twyneId);
        if (!twyne) {
            throw new Error(`Twyne with ID ${twyneId} not found`);
        }

        // Fetch storyline details from the database
        const storyline = await Storyline.findById(twyne.storyline);
        if (!storyline) {
            throw new Error(`Storyline with ID ${twyne.storyline} not found`);
        }

        // Fetch default video settings
        const story = await Story.findById(twyne.storyId);
        const defaultVideoSettings = story.defaultVideoSettings;
        if (!defaultVideoSettings) {
            throw new Error(`Default video settings not found`);
        }

        // Construct the JSON payload
        const payload = {
            storylineId: twyne.storyline,
            twyneOrientation: defaultVideoSettings.orientation,
            music: "s3://music-tracks/Shimmer_Thunder_On_Temple_Hill_instrumental_bridge_1_21.mp3",
            twyneId: twyne._id,
            title: twyne.name,
            outro: "Made With Entwyne",
            trackName: twyne.music || "Neon Beach Conspiracy Nation",
            crossfadeSettings: [
                {
                    partType: "Title Sequence",
                    crossfadeDuration: 0.5,
                    offsetInterval: 1.5
                },
                {
                    partType: "Outro Card",
                    crossfadeDuration: 0.7,
                    offsetInterval: 4
                },
                {
                    partType: "Montage",
                    crossfadeDuration: 0.4,
                    offsetInterval: 2
                },
                {
                    partType: "Interview",
                    crossfadeDuration: null,
                    offsetInterval: null
                },
            ],
            twyneQuality: defaultVideoSettings.quality,
        };


        return payload;
    } catch (error) {
        console.error('Error creating payload:', error);
        throw error;
    }
}

export default videoRenderPayload;
