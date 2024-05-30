import path from 'path';
import { promisify } from 'util';
import { exec as execCb } from 'child_process';
import {
    prepareMusicPath,
    handleClip,
    mergeClipsAndAddMusic,
    applyCrossFade,
    addMusic
} from '../utils/commonUtils.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import downloadFile from '../utils/downloadFile.js';

const exec = promisify(execCb);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(dirname(__filename));

const processMontage = async (block, twyneQuality, twyneOrientation, music, twyneId, crossfadeDuration, offsetInterval) => {
    const { clips } = block;
    const framerate = 30;
    const processingOutputFiles = []; // Array to hold output file names
    const downloadPromises = [];
    const montageOutput = path.join(__dirname, `./finals/montage_${block.orderIndex}_${twyneId}.mp4`);
    const musicBucket = "music-tracks";
    const mezzanineBucket = "dev-mezzanine-useast1";

    console.log(`Processing Montage with block: ${JSON.stringify(block)}, twyneQuality: ${twyneQuality}, twyneOrientation: ${twyneOrientation}, music: ${music}, twyneId: ${twyneId}`);

    // Download music file
    const musicFilePath = prepareMusicPath(music, block.orderIndex, __dirname);
    console.log(`Prepared music path: ${JSON.stringify(musicFilePath)}`);
    downloadPromises.push(downloadFile(musicBucket, musicFilePath.key, musicFilePath.path));

    // Prepare and queue all video clip downloads and processing
    clips.forEach(clip => {
        console.log(`Processing clip: ${JSON.stringify(clip)}`);
        const clipPromise = handleClip(clip, mezzanineBucket, twyneQuality, twyneOrientation, framerate, processingOutputFiles, __dirname, 'Montage');
        downloadPromises.push(clipPromise);
    });

    // Wait for all downloads and processing to complete
    try {
        await Promise.all(downloadPromises);
        console.log(`Processing output files: ${processingOutputFiles}`);
        console.log(`Music file path: ${musicFilePath.path}`);
        await mergeClipsAndAddMusic(processingOutputFiles, musicFilePath.path, montageOutput, applyCrossFade, addMusic, __dirname, crossfadeDuration, offsetInterval, 'Montage');
    } catch (error) {
        console.error(`Error in processing: ${error}`);
    }

    return montageOutput;
};

export default processMontage;
