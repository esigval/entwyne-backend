import { exec } from 'child_process';
import path from 'path';
import {
    prepareMusicPath,
    handleClip,
    addMusic
} from '../utils/commonUtils.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import downloadFile from '../utils/downloadFile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(dirname(__filename));

const processInterview = async (block, twyneQuality, twyneOrientation, music, twyneId) => {
    const { clips } = block;
    const framerate = 30;
    const processingOutputFiles = []; // Array to hold output file names
    const downloadPromises = [];
    const montageOutput = path.join(__dirname, `./finals/interviews_${block.orderIndex}_${twyneId}.mp4`);
    const musicBucket = "music-tracks";
    const mezzanineBucket = "dev-mezzanine-useast1";

    // Download music file
    const musicFilePath = prepareMusicPath(music, block.orderIndex, __dirname);
    downloadPromises.push(downloadFile(musicBucket, musicFilePath.key, musicFilePath.path));

    // Prepare and queue all video clip downloads and processing
    clips.forEach(clip => {
        const clipPromise = handleClip(clip, mezzanineBucket, twyneQuality, twyneOrientation, framerate, processingOutputFiles, __dirname, 'Interview');
        downloadPromises.push(clipPromise);
    });

    // Wait for all downloads and processing to complete
    try {
        await Promise.all(downloadPromises);
        // console.log(`Processing output files: ${processingOutputFiles}`);
        // console.log(`Music file path: ${musicFilePath.path}`);
        await addMusic(processingOutputFiles[0], musicFilePath.path, montageOutput, 'Interview');
    } catch (error) {
        console.error(`Error in processing: ${error}`);
    }

    return montageOutput;
};

export default processInterview;
