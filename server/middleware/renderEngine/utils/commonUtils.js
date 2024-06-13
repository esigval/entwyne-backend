import path from 'path';
import { exec } from 'child_process';
import downloadFile from './downloadFile.js';
import { promisify } from 'util';
import getScale from './getScale.js';
import calculatePad from './calculatePad.js';
import getTargetDimensions from './getTargetDimensions.js';
import ffmpegCommands from '../ffmpeg/ffmpegNarrativeCommands.js';
import fs from 'fs';

const execPromise = promisify(exec);

// Prepares the music file path
export const prepareMusicPath = (music, orderIndex, __dirname) => {
    const musicS3Path = music.replace('s3://music-tracks/', '');
    const musicParsedPath = path.parse(musicS3Path);

    // Add orderIndex to the music file name
    const musicFileName = `${musicParsedPath.name}_${orderIndex}${musicParsedPath.ext}`;
    const musicFilePath = path.join(__dirname, `./downloads/${musicFileName}`);

    // Keep the original music file name in the key
    const musicKey = (musicParsedPath.dir ? musicParsedPath.dir + '/' : '') + `${musicParsedPath.name}${musicParsedPath.ext}`;

    return { path: musicFilePath, key: musicKey };
};

export const handleClip = async (clip, bucket, quality, twyneOrientation, framerate, outputFiles, __dirname, partType) => {
    console.log(`Handling clip with partType: ${partType}`);
    const uriKey = quality === 'HD' ? 'hdUri' : 'proxyUri';
    const s3Path = clip[uriKey].replace('s3://dev-mezzanine-useast1/', '');
    const parsedPath = path.parse(s3Path);
    const key = `${parsedPath.dir}/${parsedPath.name}`;
    const outputPath = path.join(__dirname, `downloads/${parsedPath.base}`);
    await downloadFile(bucket, key, outputPath);

    const { targetScale, absoluteScale, orientation, duration } = getScale(quality, outputPath, twyneOrientation);
    const { width: targetWidth, height: targetHeight } = getTargetDimensions(quality, twyneOrientation);
    const pad = calculatePad(absoluteScale, targetWidth, targetHeight, orientation);

    console.log(`Target Scale: ${targetScale}, Absolute Scale: ${absoluteScale}, Orientation: ${orientation}`);
    console.log(`Target Width: ${targetWidth}, Target Height: ${targetHeight}`);
    console.log(`Pad: ${pad}`);

    const outputClipPath = path.join(__dirname, `processing/${partType}_${clip.orderIndex}_${clip.momentId}.mp4`);
    outputFiles.push(outputClipPath);

    if (!ffmpegCommands[partType]) {
        throw new Error(`ffmpegCommands does not have a process function for partType: ${partType}`);
    }

    if (pad === undefined) {
        throw new Error('Pad value is undefined');
    }

    const command = ffmpegCommands[partType].process(outputPath, duration, clip.length, framerate, pad, targetScale, outputClipPath);
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


// Adds music to a video file based on the part type
export const addMusic = (videoFile, musicFile, outputFile, partType) => {
    return new Promise((resolve, reject) => {
        const cmd = ffmpegCommands[partType].addMusic(videoFile, musicFile, outputFile);
        console.log(`Executing command: ${cmd}`);
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error('Error adding music:', stderr);
                reject(error);
            }
            console.log(`FFmpeg output: ${stdout}`);
            resolve(outputFile);
        });
    });
};

// Applies crossfade between two video files
export const applyCrossFade = (input1, input2, output, duration, offset) => {
    return new Promise((resolve, reject) => {
        const cmd = `ffmpeg -i "${input1}" -i "${input2}" -filter_complex "xfade=transition=wiperight:duration=${duration}:offset=${offset}" -c:v libx264 -pix_fmt yuv420p -profile:v main "${output}"`;
        console.log(`Executing command: ${cmd}`);
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error('Error applying crossfade:', stderr);
                reject(error);
            }
            console.log(`Crossfade output: ${stdout}`);
            resolve(output);
        });
    });
};

// Adds a title overlay to a video file
export const addTitleOverlay = async (videoFile, outputFile, titleText, fontPath) => {
    const cmd = `ffmpeg -i "${videoFile}" -vf "drawtext=text='${titleText}': fontfile=${fontPath}: fontsize=36: fontcolor=white@0.7: x=(w-text_w)/2: y=(h-text_h)/2" -c:v libx264 -c:a copy "${outputFile}"`;
    console.log(`Executing title overlay command: ${cmd}`);
    try {
        const { stdout, stderr } = await execPromise(cmd);
        if (stderr) {
            console.error('FFmpeg stderr:', stderr);
        }
        console.log('FFmpeg stdout:', stdout);
        console.log(`Title overlay added successfully to: ${outputFile}`);
        return outputFile;
    } catch (error) {
        console.error('Error adding title overlay:', error);
        throw error;
    }
};

// Merges clips and adds music
export const mergeClipsAndAddMusic = async (clips, musicFile, montageOutput, applyCrossFade, addMusic, __dirname, crossfadeDuration, offsetInterval, partType, orderIndex) => {
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    console.log(`Beginning on ${clips[0]}${montageOutput}`); 

    let currentFile = clips[0];
    for (let i = 1; i < clips.length; i++) {
        const nextFile = clips[i];
        const outputFile = path.join(tempDir, `temp_${path.parse(nextFile).name.split('_')[2]}_${i}_${partType}_${orderIndex}_${Math.floor(Math.random() * 10000)}.mp4`);
        const offset = i * offsetInterval;  // Calculate the offset dynamically
        const duration = crossfadeDuration;  // Use the provided crossfade duration
        await applyCrossFade(currentFile, nextFile, outputFile, duration, offset);
        currentFile = outputFile;
    }

    await addMusic(currentFile, musicFile, montageOutput, partType);
    console.log('Montage created:', montageOutput);
};


