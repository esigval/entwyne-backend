import extractClipData from "./extractClips.js";
import processTitle from "./processTitle.js";
import processOutro from "./processOutro.js";
import processMontage from "./processMontage.js";
import processInterview from "./processInterview.js";
import deleteFiles from "./deleteFiles.js";
import concatenateVideos from "./processTwyne.js";
import { dirname } from 'path';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const renderVideo = async (storylineId, twyneQuality, twyneOrientation, music, twyneId, title, outro) => {
    try {
        const narrativeBlocks = await extractClipData(storylineId);

        // Create a list of promises based on the narrative blocks
        const processingPromises = narrativeBlocks.map(block => {
            switch (block.partType) {
                case "Title Sequence":
                    return processTitle(block, twyneQuality, twyneOrientation, music, twyneId, title);
                case "Outro Card":
                    return processOutro(block, twyneQuality, twyneOrientation, music, twyneId, outro);
                case "Montage":
                    return processMontage(block, twyneQuality, twyneOrientation, music, twyneId);
                case "Interview":
                    return processInterview(block, twyneQuality, twyneOrientation, music, twyneId);
                default:
                    return Promise.reject(new Error(`Unknown part type: ${block.partType}`));
            }
        });

        // Wait for all processing promises to resolve
        const fileLocations = await Promise.all(processingPromises);
        console.log(`All blocks processed successfully. File locations:`, fileLocations);

        // Call the concatenateVideos function
        const outputPath = path.join(__dirname, 'twyne', `twyne_${twyneId}.mp4`);
        concatenateVideos(fileLocations, outputPath);

        // You might want to call deleteFiles here if it's safe to delete
        // For example, after ensuring all files are properly stored or further processed
        await deleteFiles(fileLocations); // Ensure deleteFiles is prepared to handle a list of files

        // Additional logic to finalize the video compilation could go here
    } catch (error) {
        console.error(`An error occurred during video rendering: ${error}`);
        // Handle errors, possibly retry failed operations or clean up
    }
}

// Example call to the function
renderVideo("662adef494d07d65cfb47cce", "Proxy", "horizontal", "s3://music-tracks/Neon_Beach_Conspiracy_Nation_background_vocals_2_32.mp3", "65f138c9336de84ab7cb3ed7", "The Greatest Rock", "Made With Entwyne");
