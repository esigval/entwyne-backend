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
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Example usage
const narrativeBlock = {
    "partType": "Montage",
    "orderIndex": 0,
    "clips": [
      {
        "orderIndex": "0.0",
        "type": "Video",
        "partType": "Montage",
        "promptId": "662adefd94d07d65cfb47cdb",
        "length": 2,
        "cutSpeed": "timed",
        "momentId": "662b270594d07d65cfb47cf1",
        "proxyUri": "s3://dev-mezzanine-useast1/6625b0a01ad7958d21275e94/proxy/662b270594d07d65cfb47cf1.mp4"
      },
      {
        "orderIndex": "0.1",
        "type": "Video",
        "partType": "Montage",
        "promptId": "662adefd94d07d65cfb47cdc",
        "length": 2,
        "cutSpeed": "timed",
        "momentId": "662aed1a94d07d65cfb47cef",
        "proxyUri": "s3://dev-mezzanine-useast1/6625b0a01ad7958d21275e94/proxy/662aed1a94d07d65cfb47cef.mp4"
      },
      {
        "orderIndex": "0.2",
        "type": "Video",
        "partType": "Montage",
        "promptId": "662adefd94d07d65cfb47cdd",
        "length": 2,
        "cutSpeed": "timed",
        "momentId": "662aedb894d07d65cfb47cf0",
        "proxyUri": "s3://dev-mezzanine-useast1/6625b0a01ad7958d21275e94/proxy/662aedb894d07d65cfb47cf0.mp4"
      }
    ]
  };


const processMontage = async (block, twyneQuality, twyneOrientation, music, twyneId) => {
    const { clips } = block;
    console.log(clips); // Add this line to log the clips
    const framerate = 30;
    const processingOutputFiles = []; // Array to hold output file names
    const downloadPromises = [];
    const montageOutputFile = path.join(__dirname, 'finals', `montage_${block.orderIndex}_${twyneId}.mp4`);
    const montageOutput = `finals/montage_${block.orderIndex}_${twyneId}.mp4`;
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
      // Make sure to await this function
      await mergeClipsAndAddMusic(processingOutputFiles, musicFilePath.path, montageOutput);
      console.log('Montage and music merge completed successfully.');
  } catch (error) {
      console.error(`Error in processing: ${error}`);
  }
  return montageOutputFile;
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
    const outputClipPath = path.join(__dirname, `processing/${clip.partType}_${clip.orderIndex}_${clip.momentId}.mp4`);
    outputFiles.push(outputClipPath);

    const command = ffmpegCommands["Montage"].cutAndNormalize(outputPath, clip.length, framerate, pad, scale, outputClipPath);
    try {
        const { stdout } = await exec(command);
        console.log(`Command output: ${stdout}`);
    } catch (error) {
        console.error(`Error executing command: ${error}`);
        throw error;
    }
};

const mergeClipsAndAddMusic = async (clips, musicFile, montageOutput) => {
    // Create a directory to store intermediate files
    const tempDir = path.join(__dirname, 'temp');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir);
    }
  
    let currentFile = clips[0];
    for (let i = 1; i < clips.length; i++) {
      const nextFile = clips[i];
const momentId = path.parse(nextFile).name.split('_')[2];
const outputFile = path.join(tempDir, `temp_${momentId}_${i}.mp4`);
      const offset = i * 3;  // Example offset for crossfade
      await applyCrossFade(currentFile, nextFile, outputFile, 0.5, offset);
      currentFile = outputFile;  // Set the current file to the latest output
    }
  
    // Add background music
    const finalOutput = path.join(__dirname, montageOutput);
    await addMusic(currentFile, musicFile, finalOutput);
  
    console.log('Montage created:', finalOutput);
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

  export default processMontage;



// processMontage(narrativeBlock, 'Proxy', 'horizontal', 's3://music-tracks/Neon_Beach_Conspiracy_Nation_background_vocals_2_32.mp3');


