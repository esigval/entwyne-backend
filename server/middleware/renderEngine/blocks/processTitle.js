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

const processTitle = async (block, twyneQuality, twyneOrientation, music, twyneId, title, crossfadeDuration, offsetInterval) => {
    const { clips } = block;
    const framerate = 30;
    const processingOutputFiles = []; // Array to hold output file names
    const downloadPromises = [];
    const intermediateOutput = path.join(__dirname, `./finals/title_intermediate_${block.orderIndex}_${twyneId}.mp4`);
    const finalOutput = path.join(__dirname, `./finals/title_${block.orderIndex}_${twyneId}.mp4`);
    const musicBucket = "music-tracks";
    const mezzanineBucket = "dev-mezzanine-useast1";

    //console.log(`Processing Title with block: ${JSON.stringify(block)}, twyneQuality: ${twyneQuality}, twyneOrientation: ${twyneOrientation}, music: ${music}, twyneId: ${twyneId}, title: ${title}`);

    // Download music file
    const musicFilePath = prepareMusicPath(music, block.orderIndex, __dirname);
    //console.log(`Prepared music path: ${JSON.stringify(musicFilePath)}`);
    downloadPromises.push(downloadFile(musicBucket, musicFilePath.key, musicFilePath.path));

    // Prepare and queue all video clip downloads and processing
    clips.forEach(clip => {
        const clipPromise = handleClip(clip, mezzanineBucket, twyneQuality, twyneOrientation, framerate, processingOutputFiles, __dirname, 'Title');
        downloadPromises.push(clipPromise);
    });

    // Wait for all downloads and processing to complete
    try {
        //console.log('Waiting for all download promises to resolve...');
        await Promise.all(downloadPromises);
        //console.log(`All clips processed. Output files: ${processingOutputFiles}`);
        //console.log(`Music file path: ${musicFilePath.path}`);

        if (processingOutputFiles.length > 1) {
            //console.log(`Merging clips and adding music...`);
            await mergeClipsAndAddMusic(processingOutputFiles, musicFilePath.path, intermediateOutput, applyCrossFade, addMusic, __dirname, crossfadeDuration, offsetInterval, 'Title');
            //console.log(`Clips merged and music added. Intermediate output: ${intermediateOutput}`);
        } else {
            //console.log(`Single clip, adding music directly...`);
            await addMusic(processingOutputFiles[0], musicFilePath.path, intermediateOutput, 'Title');
            //console.log(`Music added. Intermediate output: ${intermediateOutput}`);
        }

        if (title) {
            const fontPath = '/usr/local/share/fonts/GearedSlab.ttf';  // Ensure the font path is correct
            //console.log(`Adding title overlay...`);
            await addTitleOverlay(intermediateOutput, finalOutput, title, fontPath);
            //console.log(`Title overlay added. Final output: ${finalOutput}`);
            // Optionally remove the intermediate file if it's no longer needed
            fs.unlinkSync(intermediateOutput);
            return finalOutput;
        } else {
            fs.renameSync(intermediateOutput, finalOutput);
            //console.log(`Renamed intermediate output to final output: ${finalOutput}`);
            return finalOutput;
        }
    } catch (error) {
        console.error(`Error in processing: ${error}`);
        throw error;
    }
};

export default processTitle;
