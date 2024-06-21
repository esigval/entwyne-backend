import extractClipData from "./utils/extractClips.js";
import processTitle from "./blocks/processTitle.js";
import processOutro from "./blocks/processOutro.js";
import processMontage from "./blocks/processMontage.js";
import processInterview from "./blocks/processInterview.js";
import deleteFiles from "./utils/deleteFiles.js";
import concatenateVideos from "./blocks/processTwyne.js";
import Storyline from "../../models/storylineModel.js";
import Twyne from "../../models/twyneModel.js";
import { dirname } from 'path';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { uploadToS3 } from './utils/generateS3Key.js';
import getMusicTracks from './music/getMusicTracks.js'; // Adjust the import path accordingly

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const renderVideo = async (jsonConfig, userId) => {
    const { storylineId, twyneQuality, twyneOrientation, music, twyneId, title, outro, crossfadeSettings, trackName } = jsonConfig;
    let fileLocations = [];
    try {
        const narrativeBlocks = await extractClipData(storylineId);
        if (!narrativeBlocks || narrativeBlocks.length === 0) {
            return { status: 'error', message: 'No narrative blocks found.' };
        }

        // Get the music tracks for the specified track name
        const musicTracks = await getMusicTracks(trackName);

        // Map the crossfade settings by part type for easier lookup
        const crossfadeSettingsMap = crossfadeSettings.reduce((acc, setting) => {
            acc[setting.partType] = setting;
            return acc;
        }, {});

        // Enrich narrative blocks with crossfade settings and music paths
        const enrichedNarrativeBlocks = narrativeBlocks.map((block) => {
            const clipsPartType = block.clips[0]?.partType || block.partType;
            const settings = crossfadeSettingsMap[clipsPartType] || {};
            const musicPath = musicTracks[clipsPartType]?.uri || music;

            console.log(`Block:`, JSON.stringify(block, null, 2));
            console.log(`Crossfade Settings:`, JSON.stringify(settings, null, 2));

            return { ...block, ...settings, partType: clipsPartType, musicPath };
        });

        // Log the enriched narrative blocks for debugging
        console.log('Enriched Narrative Blocks:', JSON.stringify(enrichedNarrativeBlocks, null, 2));

        // Create a list of promises based on the narrative blocks
        const processingPromises = enrichedNarrativeBlocks.map(async (block) => {
            const { partType, crossfadeDuration, offsetInterval, musicPath } = block;

            try {
                console.log(`Processing block of type: ${partType}`);
                let result;
                switch (partType) {
                    case "Title Sequence":
                        result = await processTitle(block, twyneQuality, twyneOrientation, musicPath, twyneId, title, crossfadeDuration, offsetInterval);
                        break;
                    case "Outro Card":
                        result = await processOutro(block, twyneQuality, twyneOrientation, musicPath, twyneId, outro, crossfadeDuration, offsetInterval);
                        break;
                    case "Montage":
                        result = await processMontage(block, twyneQuality, twyneOrientation, musicPath, twyneId, crossfadeDuration, offsetInterval);
                        break;
                    case "Interview":
                        result = await processInterview(block, twyneQuality, twyneOrientation, musicPath, twyneId);
                        break;
                    default:
                        throw new Error(`Unknown part type: ${partType}`);
                }
                console.log(`Completed processing block of type: ${partType}, result: ${result}`);
                return result;
            } catch (error) {
                console.error(`Error processing block of type: ${partType}`, error);
                throw error;
            }
        });

        // Wait for all processing promises to resolve
        fileLocations = await Promise.all(processingPromises);
        console.log(`All blocks processed successfully. File locations:`, fileLocations);

        
        // Call the concatenateVideos function
        const outputPath = path.join(__dirname, 'twyne', `twyne_${twyneId}.mp4`);
        const { outputPath: concatenatedFilePath, thumbnailPath } = await concatenateVideos(fileLocations, outputPath);

        // Upload the concatenated video and get the S3 key
        const videoS3Key = await uploadToS3(concatenatedFilePath, false, userId, twyneId, twyneQuality, storylineId);

        // Upload the thumbnail and get the S3 key
        const thumbnailS3Key = await uploadToS3(thumbnailPath, true, userId, twyneId, 'thumbnail', storylineId);

        // Update the storyline record with the S3 link
        const renderSwitch = await Storyline.updateTwyneRenderUri(storylineId, videoS3Key);
        console.log('UpdatedUri:', renderSwitch);

        const updatedStoryline = await Storyline.updateRenderedStatus(storylineId, true);
        console.log('UpdatedStoryline:', updatedStoryline);

        const twyneCurrent = await Twyne.setCurrentRender(twyneId, videoS3Key);
        console.log('TwyneCurrent:', twyneCurrent);

        const setTwyneThumbnail = await Twyne.updateThumbnail(twyneId, thumbnailS3Key);

        console.log(`Video rendering completed successfully. Output path: ${outputPath}`);
    } catch (error) {
        console.error(`An error occurred during video rendering: ${error}`);
        return { status: 'error', message: `An error occurred during video rendering: ${error.message}` };
    } finally {
        // Optionally delete the intermediate files in both success and error cases
        if (fileLocations.length > 0) {
            await deleteFiles(fileLocations);
            console.log('Intermediate files deleted.');
        }
    }
    
};

export default renderVideo;


const userId = '65e78760183d35f4ccc6c57d';

const jsonConfig = {
    "storylineId": "66759714131265b4131a5ca5",
    "twyneQuality": "Proxy",
    "twyneOrientation": "horizontal",
    "music": "s3://music-tracks/Montage/Neon_Beach_Humblebrag_instrumental_verse_0_21.mp3",
    "twyneId": "6675968f131265b4131a5c9b",
    "title": "Pacific Crest Endurance Weekend",
    "outro": "Join Us Next Year",
    "trackName": "Neon Beach Humblebrag Instrumental",
    "crossfadeSettings": [
        {
            "partType": "Title Sequence",
            "crossfadeDuration": 0.5,
            "offsetInterval": 1.5
        },
        {
            "partType": "Outro Card",
            "crossfadeDuration": 0.7,
            "offsetInterval": 1
        },
        {
            "partType": "Montage",
            "crossfadeDuration": 0.4,
            "offsetInterval": 2
        },
        {
            "partType": "Interview"
        }
    ]
};



// Example call to the function
renderVideo(jsonConfig, userId); 
