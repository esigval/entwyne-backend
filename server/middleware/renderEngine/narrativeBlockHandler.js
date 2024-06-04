import extractClipData from "./utils/extractClips.js";
import processTitle from "./blocks/processTitle.js";
import processOutro from "./blocks/processOutro.js";
import processMontage from "./blocks/processMontage.js";
import processInterview from "./blocks/processInterview.js";
import deleteFiles from "./utils/deleteFiles.js";
import concatenateVideos from "./blocks/processTwyne.js";
import AWS from 'aws-sdk';
import fs from 'fs';
import Storyline from "../../models/storylineModel.js";
import Twyne from "../../models/twyneModel.js";
import { config } from "../../config.js";
import { dirname } from 'path';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import getMusicTracks from './music/getMusicTracks.js'; // Adjust the import path accordingly

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];


// Configure AWS
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Create an S3 instance
const s3 = new AWS.S3();

const renderVideo = async (jsonConfig, userId) => {
    const { storylineId, twyneQuality, twyneOrientation, music, twyneId, title, outro, crossfadeSettings, trackName } = jsonConfig;

    try {
        const narrativeBlocks = await extractClipData(storylineId);
        if (!narrativeBlocks || narrativeBlocks.length === 0) {
            return { status: 'error', message: 'No narrative blocks found.' };
        }
        // Get the music tracks for the specified track name
        const musicTracks = await getMusicTracks(trackName);

        // Enrich narrative blocks with crossfade settings and music paths
        const enrichedNarrativeBlocks = narrativeBlocks.map((block, index) => {
            const settings = crossfadeSettings[index];
            const clipsPartType = block.clips[0]?.partType || block.partType;
            const musicPath = musicTracks[clipsPartType]?.uri || music;

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
        const fileLocations = await Promise.all(processingPromises);
        console.log(`All blocks processed successfully. File locations:`, fileLocations);

        // Call the concatenateVideos function
        const outputPath = path.join(__dirname, 'twyne', `twyne_${twyneId}.mp4`);
        const concatenatedFilePath = await concatenateVideos(fileLocations, outputPath);

        // Read the output file into a variable
        const fileContent = fs.readFileSync(concatenatedFilePath);

        // name the twyne entry for s3

        const params = {
            Bucket: currentConfig.TWYNE_BUCKET,
            Key: `${userId}/${twyneId}/twyne_${twyneQuality}_${storylineId}.mp4`, // File name you want to save as in S3
            Body: fileContent,
        };

        // Uploading files to the bucket
        s3.upload(params, function (err, data) {
            if (err) {
                throw err;
            }
            console.log(`File uploaded successfully. ${data.Location}`);

            // Delete the local file
            fs.unlink(concatenatedFilePath, function (err) {
                if (err) {
                    console.error(`Error deleting file ${concatenatedFilePath}: ${err}`);
                } else {
                    console.log(`File deleted successfully: ${concatenatedFilePath}`);
                }
            });
        });

        // Add the S3 prefix to params.Key
    params.Key = `s3://${params.Bucket}/${params.Key}`;

        // Update the storyline record with the S3 link
        const renderSwitch = await Storyline.updateTwyneRenderUri(storylineId, params.Key);
        console.log('UpdatedUri:', renderSwitch);

        const updatedStoryline = await Storyline.updateRenderedStatus(storylineId, true);
        console.log('UpdatedStoryline:', updatedStoryline);

        const twyneCurrent = await Twyne.setCurrentRender(twyneId, params.Key);
        console.log('TwyneCurrent:', twyneCurrent);

        // Optionally delete the intermediate files
        await deleteFiles(fileLocations);

        console.log(`Video rendering completed successfully. Output path: ${outputPath}`);
    } catch (error) {
        console.error(`An error occurred during video rendering: ${error}`);
        return { status: 'error', message: `An error occurred during video rendering: ${error.message}` };
    }
};

export default renderVideo;

/*
const userId = '65e78760183d35f4ccc6c57d';

const jsonConfig = {
    "storylineId": "662adef494d07d65cfb47cce",
    "twyneQuality": "Proxy",
    "twyneOrientation": "horizontal",
    "music": "s3://music-tracks/Neon_Beach_Conspiracy_Nation_background_vocals_2_32.mp3",
    "twyneId": "662ade3694d07d65cfb47ccb",
    "title": "The Greatest Rock",
    "outro": "Made With Entwyne",
    "trackName": "Neon Beach Conspiracy Nation",
    "crossfadeSettings": [
        {
            "partType": "Title Sequence",
            "crossfadeDuration": 0.5,
            "offsetInterval": 1.5
        },
        {
            "partType": "Outro Card",
            "crossfadeDuration": 0.7,
            "offsetInterval": 4
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
renderVideo(jsonConfig, userId); */