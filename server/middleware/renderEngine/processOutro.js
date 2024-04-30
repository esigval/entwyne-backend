import { promisify } from 'util';
import { exec as execCb } from 'child_process';
import path from 'path';
import getScale from './getScale.js';
import downloadFile from './downloadFile.js';
import ffmpegCommands from './ffmpegNarrativeCommands.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import calculatePad from './calculatePad.js';
import fs from 'fs';
import getTargetDimensions from './getTargetDimensions.js';
const exec = promisify(execCb);
const narrativeBlock = {
    "partType": "Outro Card",
    "orderIndex": 4,
    "clips": [
      {
        "orderIndex": "4.0",
        "type": "Video",
        "partType": "Outro Card",
        "promptId": "662adefd94d07d65cfb47ce5",
        "length": 5,
        "cutSpeed": "flexible",
        "momentId": "662ae7cb94d07d65cfb47ceb",
        "proxyUri": "s3://dev-mezzanine-useast1/6625b0a01ad7958d21275e94/proxy/662ae7cb94d07d65cfb47ceb.mp4"
      }
    ]
  };


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const processOutro = async (block, twyneQuality, twyneOrientation, music, twyneId, title) => {
    const { clips } = block;
    const framerate = 30;
    const processingOutputFiles = []; // Array to hold output file names
    const downloadPromises = [];
   const montageOutput = path.join(__dirname, `finals/outro_${block.orderIndex}_${twyneId}`);
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
        mergeClipsAndAddMusic(processingOutputFiles, musicFilePath.path, montageOutput, title);
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
    const key = parsedPath.dir + '/' + parsedPath.name;

    const outputPath = path.join(__dirname, `downloads/${parsedPath.base}`);
    await downloadFile(bucket, key, outputPath);

    const { scale, absoluteScale, orientation } = getScale(quality, outputPath);
    const { width: targetWidth, height: targetHeight } = getTargetDimensions(quality, twyneOrientation);
    const pad = calculatePad(absoluteScale, targetWidth, targetHeight, orientation);
    const outputClipPath = path.join(__dirname, `processing/${clip.partType.replace(/\s/g, '_')}_${clip.orderIndex.replace(/\s/g, '_')}_${clip.momentId.replace(/\s/g, '_')}.mp4`);
    outputFiles.push(outputClipPath);

    const command = ffmpegCommands["Montage"].cutAndNormalize(outputPath, clip.length, framerate, pad, scale, outputClipPath);
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

const mergeClipsAndAddMusic = async (clips, musicFile, montageOutput, title) => {
    // Create a directory to store intermediate files
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
        fs.mkdirSync(tempDir);
    }

    let currentFile = clips[0];

    // Only apply crossfade if there is more than one clip
    if (clips.length > 1) {
        for (let i = 1; i < clips.length; i++) {
            const nextFile = clips[i];
            const outputFile = path.join(tempDir, `temp_${clips.momentId}_${i}.mp4`);
            const offset = i * 1;  // Example offset for crossfade
            await applyCrossFade(currentFile, nextFile, outputFile, 0.5, offset);
            currentFile = outputFile;  // Set the current file to the latest output
        }
    }

    // Add background music
    const montageWithMusic = path.join(tempDir, 'final_with_music.mp4');
    await addMusic(currentFile, musicFile, montageWithMusic);
    const finalOutputWithOverlay = path.join(montageOutput);
    await addTitleOverlay(montageWithMusic, finalOutputWithOverlay, title);
};

const addTitleOverlay = async (videoFile, outputFile, titleText) => {
    const fontPath = '/server/fonts/GearedSlab.ttf';  // Ensure the font path is correct
    const cmd = `ffmpeg -i "${videoFile}" -vf "drawtext=text='${titleText}': fontfile=${fontPath}: fontsize=36: fontcolor=white@0.7: x=(w-text_w)/2: y=(h-text_h)/2" -c:v libx264 -c:a copy "${outputFile}.mp4"`;  // Add quotes around file paths
    try {
        const { stdout, stderr } = await exec(cmd);
        console.log(`Command output: ${stdout}`);
        return `${outputFile}.mp4`;  // Add .mp4 extension
    } catch (error) {
        console.error('Error adding title overlay:', error);
        throw error;
    }
};

const applyCrossFade = (input1, input2, output, duration, offset) => {
    return new Promise((resolve, reject) => {
        const cmd = `ffmpeg -i ${input1} -i ${input2} -filter_complex "xfade=transition=wiperight:duration=${duration}:offset=${offset}" -c:v libx264 -pix_fmt yuv420p -profile:v main ${output}`;

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error('Error applying crossfade:', stderr);
                reject(error);
            }
            resolve(output);
        });
    });
};



const addMusic = (videoFile, musicFile, outputFile) => {
    return new Promise((resolve, reject) => {
        const cmd = `ffmpeg -i ${videoFile} -i ${musicFile} -c:v libx264 -c:a aac -strict experimental -shortest -f mp4 ${outputFile}`;
        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error('Error adding music:', stderr);
                reject(error);
            }
            resolve(outputFile);
        });
    });
};

export default processOutro;



processOutro(narrativeBlock, 'Proxy', 'horizontal', 's3://music-tracks/Neon_Beach_Conspiracy_Nation_background_vocals_2_32.mp3', '28734623823387f', 'Made With Entwyne');


