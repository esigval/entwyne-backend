import { exec } from 'child_process';
import path from 'path';
import getScale from './getScale.js';
import downloadFile from './downloadFile.js';
import ffmpegCommands from './ffmpegNarrativeCommands.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import calculatePad from './calculatePad.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Example usage
const narrativeBlock = {
    "partType": "Montage",
    "orderIndex": 2,
    "clips": [
        {
            "orderIndex": "2.0",
            "type": "Video",
            "partType": "Montage",
            "promptId": "662adefd94d07d65cfb47cdf",
            "length": 4,
            "cutSpeed": "timed",
            "momentId": "662aec4b94d07d65cfb47cee",
            "proxyUri": "s3://dev-mezzanine-useast1/6625b0a01ad7958d21275e94/proxy/662aec4b94d07d65cfb47cee.mp4"
        },
        {
            "orderIndex": "2.1",
            "type": "Video",
            "partType": "Montage",
            "promptId": "662adefd94d07d65cfb47ce0",
            "length": 4,
            "cutSpeed": "timed",
            "momentId": "662aebd194d07d65cfb47ced",
            "proxyUri": "s3://dev-mezzanine-useast1/6625b0a01ad7958d21275e94/proxy/662aebd194d07d65cfb47ced.mp4"
        },
        {
            "orderIndex": "2.2",
            "type": "Video",
            "partType": "Montage",
            "promptId": "662adefd94d07d65cfb47ce1",
            "length": 4,
            "cutSpeed": "timed",
            "momentId": "662ae4e194d07d65cfb47ce8",
            "proxyUri": "s3://dev-mezzanine-useast1/6625b0a01ad7958d21275e94/proxy/662ae4e194d07d65cfb47ce8.mp4"
        },
        {
            "orderIndex": "2.3",
            "type": "Video",
            "partType": "Montage",
            "promptId": "662adefd94d07d65cfb47ce2",
            "length": 4,
            "cutSpeed": "timed",
            "momentId": "662ae71a94d07d65cfb47cea",
            "proxyUri": "s3://dev-mezzanine-useast1/6625b0a01ad7958d21275e94/proxy/662ae71a94d07d65cfb47cea.mp4"
        },
        {
            "orderIndex": "2.4",
            "type": "Video",
            "partType": "Montage",
            "promptId": "662adefd94d07d65cfb47ce3",
            "length": 4,
            "cutSpeed": "timed",
            "momentId": "662aea3294d07d65cfb47cec",
            "proxyUri": "s3://dev-mezzanine-useast1/6625b0a01ad7958d21275e94/proxy/662aea3294d07d65cfb47cec.mp4"
        }
    ]
};


const processMontage = async (block, twyneQuality, twyneOrientation) => {
    const { clips } = block;
    const framerate = 30;
    
    
    const musicFile = 'path/to/background_music.mp3';

    for (let clip of clips) {
        const outputPath = path.join(__dirname, `downloads/${clip.momentId}.mp4`); // Define the local storage path
        const s3Path = clip.proxyUri.replace('s3://dev-mezzanine-useast1/', '');
        const parsedPath = path.parse(s3Path);
        const key = parsedPath.dir + '/' + parsedPath.name;
        await downloadFile(key, outputPath); // Download the fil

        const quality = getScale(twyneQuality, outputPath);
        const pad = calculatePad(quality ,twyneOrientation);

        const outputClipPath = path.join(__dirname, `processing/${clip.partType}_${clip.orderIndex}_${clip.momentId}.mp4`);
        const command = ffmpegCommands["Montage"].cutAndNormalize(outputPath, clip.length, framerate, pad, quality, outputClipPath);
        console.log("FFMPEG Command for each clip:", command);
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error executing command: ${error}`);
                return;
            }
            console.log(`Command output: ${stdout}`);
        });

    }
    
    // After downloading and processing each clip, merge them and add music
    const processedClips = clips.map(clip => clip.proxyUri.replace('.mp4', '_temp.mp4'));
    const mergeCommand = ffmpegCommands["Montage"].mergeAndAddMusic(processedClips, musicFile);
    console.log("FFMPEG Command to merge and add music:", mergeCommand);
    exec(mergeCommand, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error executing command: ${error}`);
            return;
        }
        console.log(`Command output: ${stdout}`);
    });
}
    

processMontage(narrativeBlock, 'Proxy', 'horizontal');


