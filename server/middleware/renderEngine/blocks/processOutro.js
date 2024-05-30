import path from 'path';
import { promisify } from 'util';
import { exec as execCb } from 'child_process';
import {
    prepareMusicPath,
    handleClip,
    mergeClipsAndAddMusic,
    addTitleOverlay,
    applyCrossFade,
    addMusic
} from '../utils/commonUtils.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import downloadFile from '../utils/downloadFile.js';
import fs from 'fs';

const exec = promisify(execCb);
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(dirname(__filename));

const processOutro = async (block, twyneQuality, twyneOrientation, music, twyneId, title, crossfadeDuration, offsetInterval) => {
    const { clips } = block;
    const framerate = 30;
    const processingOutputFiles = []; // Array to hold output file names
    const downloadPromises = [];
    const montageOutputIntermediate = path.join(__dirname, `./finals/outro_intermediate_${block.orderIndex}_${twyneId}.mp4`);
    const montageOutputFinal = path.join(__dirname, `./finals/outro_${block.orderIndex}_${twyneId}.mp4`);
    const musicBucket = "music-tracks";
    const mezzanineBucket = "dev-mezzanine-useast1";

    console.log(`Processing Outro with block: ${JSON.stringify(block)}, twyneQuality: ${twyneQuality}, twyneOrientation: ${twyneOrientation}, music: ${music}, twyneId: ${twyneId}, title: ${title}`);

    // Download music file
    const musicFilePath = prepareMusicPath(music, block.orderIndex, __dirname);
    console.log(`Prepared music path: ${JSON.stringify(musicFilePath)}`);
    downloadPromises.push(downloadFile(musicBucket, musicFilePath.key, musicFilePath.path));

    // Prepare and queue all video clip downloads and processing
    clips.forEach(clip => {
        console.log(`Processing clip: ${JSON.stringify(clip)}`);
        const clipPromise = handleClip(clip, mezzanineBucket, twyneQuality, twyneOrientation, framerate, processingOutputFiles, __dirname, 'Outro');
        downloadPromises.push(clipPromise);
    });

    // Wait for all downloads and processing to complete
    try {
        console.log('Waiting for all download promises to resolve...');
        await Promise.all(downloadPromises);
        console.log(`All clips processed. Output files: ${processingOutputFiles}`);
        console.log(`Music file path: ${musicFilePath.path}`);

        if (processingOutputFiles.length > 1) {
            console.log('Merging clips and adding music...');
            await mergeClipsAndAddMusic(processingOutputFiles, musicFilePath.path, montageOutputIntermediate, applyCrossFade, addMusic, __dirname, crossfadeDuration, offsetInterval, 'Outro');
            console.log(`Clips merged and music added. Intermediate montage output: ${montageOutputIntermediate}`);
        } else {
            console.log('Single clip, adding music directly...');
            await addMusic(processingOutputFiles[0], musicFilePath.path, montageOutputIntermediate, 'Outro');
            console.log(`Music added. Intermediate montage output: ${montageOutputIntermediate}`);
        }

        if (title) {
            const fontPath = '/server/fonts/GearedSlab.ttf';  // Ensure the font path is correct
            console.log(`Adding title overlay...`);
            await addTitleOverlay(montageOutputIntermediate, montageOutputFinal, title, fontPath);
            console.log(`Title overlay added. Final output: ${montageOutputFinal}`);
        } else {
            console.log(`No title overlay needed. Final output: ${montageOutputIntermediate}`);
            fs.renameSync(montageOutputIntermediate, montageOutputFinal);  // Rename intermediate to final if no title
        }

        console.log(`Processing Outro completed successfully: ${montageOutputFinal}`);
        return montageOutputFinal;
    } catch (error) {
        console.error(`Error in processing: ${error}`);
        throw error;
    }
};

export default processOutro;
