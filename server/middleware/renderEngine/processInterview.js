import { exec } from 'child_process';
import path from 'path';
import getScale from './getScale.js';
import downloadFile from './downloadFile.js';
import ffmpegCommands from './ffmpegNarrativeCommands.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import calculatePad from './calculatePad.js';
import fs from 'fs';
import getTargetDimensions from './getTargetDimensions.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const processInterview = async (block, twyneQuality, twyneOrientation, music, twyneId) => {
    const { clips } = block;
    const framerate = 30;
    const processingOutputFiles = []; // Array to hold output file names
    const downloadPromises = [];
    const montageOutput = path.join(__dirname, `finals/interviews${block.orderIndex}_${twyneId}.mp4`);
    const musicBucket = "music-tracks";
    const mezzanineBucket = "dev-mezzanine-useast1";

    // Download music file
    const musicFilePath = prepareMusicPath(music, block.orderIndex);
    downloadPromises.push(downloadFile(musicBucket, musicFilePath.key, musicFilePath.path));

    // Prepare and queue all video clip downloads and processing
    clips.forEach(clip => {
        const clipPromise = handleClip(clip, mezzanineBucket, twyneQuality, twyneOrientation, framerate, processingOutputFiles);
        downloadPromises.push(clipPromise);
    });

    // Wait for all downloads and processing to complete
    try {
        await Promise.all(downloadPromises);
        // Since merge and crossfade are not needed, we directly add music
        addMusic(processingOutputFiles[0], musicFilePath.path, montageOutput);
    } catch (error) {
        console.error(`Error in processing: ${error}`);
    }

    return montageOutput;
};

const prepareMusicPath = (music, orderIndex) => {
    const musicS3Path = music.replace('s3://music-tracks/', '');
    console.log(`Music S3 Path: ${musicS3Path}`);

    const musicParsedPath = path.parse(musicS3Path);
    console.log(`Parsed Music Path: ${JSON.stringify(musicParsedPath)}`);

    // Add orderIndex to the music file name
    const musicFileName = `${musicParsedPath.name}_${orderIndex}${musicParsedPath.ext}`;

    const musicFilePath = path.join(__dirname, `downloads/music${musicFileName}`);
    console.log(`Music File Path: ${musicFilePath}`);

    // Keep the original music file name in the key
    const musicKey = (musicParsedPath.dir ? musicParsedPath.dir + '/' : '') + `${musicParsedPath.name}${musicParsedPath.ext}`;
    console.log(`Music Key: ${musicKey}`);

    return { path: musicFilePath, key: musicKey };
};



const handleClip = async (clip, bucket, quality, twyneOrientation, framerate, outputFiles) => {
    const uriKey = quality === 'HD' ? 'hdUri' : 'proxyUri';
    const s3Path = clip[uriKey].replace('s3://dev-mezzanine-useast1/', '');
    const parsedPath = path.parse(s3Path);
    const key = `${parsedPath.dir}/${parsedPath.name}`;

    const outputPath = path.join(__dirname, `downloads/${parsedPath.base}`);
    await downloadFile(bucket, key, outputPath);

    const { scale, absoluteScale, orientation } = getScale(quality, outputPath);
    console.log(`absoluteScale: ${absoluteScale}`);
    const { width: targetWidth, height: targetHeight } = getTargetDimensions(quality, twyneOrientation);
    console.log(`Target Width: ${targetWidth}, Target Height: ${targetHeight}`);
    const pad = calculatePad(absoluteScale, targetWidth, targetHeight, orientation);
    console.log(`Pad: ${pad}`);
    const outputClipPath = path.join(__dirname, `processing/${clip.partType}_${clip.orderIndex}_${clip.momentId}.mp4`);
    outputFiles.push(outputClipPath);

    const command = ffmpegCommands["Interview"].process(outputPath, clip.length, framerate, pad, scale, outputClipPath);
    console.log(`Executing command: ${command}`);
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error}`);
                reject(error);
            } else {
                console.log(`Command output: ${stdout}`);
                resolve();
            }
        });
    });
};

const addMusic = async (videoFile, musicFile, outputFile) => {
    return new Promise((resolve, reject) => {
        const cmd = `ffmpeg -i ${videoFile} -i ${musicFile} -c:v copy -c:a aac -strict experimental -shortest ${outputFile}`;
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error('Error adding music:', stderr);
                reject(error);
            }
            resolve(outputFile);
        });
    });
};

export default processInterview;

// Call this function with appropriate parameters
// processInterview(narrativeBlock, 'Proxy', 'vertical', 's3://music-tracks/Neon_Beach_Conspiracy_Nation_background_vocals_2_32.mp3', '65f138c9336de84ab7cb3ed7');
