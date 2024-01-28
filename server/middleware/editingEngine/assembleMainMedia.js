import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import processMedia from './processMedia.js';
import createTitleCard from './titleScreen.js';
import uploadFinalVideoToS3 from './uploadFinalVideotoS3.js';
import { cleanMedia } from './cleanMedia.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const assembleMainMedia = async (storylineId, coupleName, marriageDate, musicName, order) => {

    console.time('assembleMainMedia');
    // Assuming processImagesToVideo function handles the conversion of images to videos
    await createTitleCard(coupleName, marriageDate, path.join(__dirname, 'quedVideos'));
    await processMedia(storylineId, order);

    // Have to Get This File From S3 Path
    const renderingOrderFilePath = path.join(__dirname, 'quedVideos', 'BodyClips.txt');

    const outputFolder = path.join(__dirname, 'renderedVideos');
    if (!fs.existsSync(outputFolder)) {
        fs.mkdirSync(outputFolder, { recursive: true });
    }
    const concatenatedOutput = path.join(outputFolder, `concatenated_${storylineId}.mp4`);
    const commandConcat = `ffmpeg -f concat -safe 0 -i "${renderingOrderFilePath}" -c:v libx264 -pix_fmt yuv420p -r 30 -af "volume=1.5" -c:a aac "${concatenatedOutput}"`;
    execSync(commandConcat);

    // Forward the title card video by 2.5 seconds
    const titleCardDuration = 2.5; // Duration of the title card video in seconds
    const delayInMillisec = titleCardDuration * 1000;

    const titleCardPath = path.join(__dirname, 'quedVideos', 'titleCard.mp4');
    const transitionOutput = path.join(__dirname, `quedVideos`, 'transition.mp4');
    const commandTransition = `ffmpeg -i ${titleCardPath} -i ${concatenatedOutput} -filter_complex "[0:v][1:v]xfade=transition=fade:duration=2:offset=2.5[v]; [1:a]adelay=${delayInMillisec}|${delayInMillisec}[delayedaudio]" -map "[v]" -map "[delayedaudio]" -c:v libx264 -pix_fmt yuv420p -r 30 -c:a aac "${transitionOutput}"`;
    execSync(commandTransition);

    const musicFilePath = path.join(__dirname, 'music', musicName);
    const finalOutputPath = path.join(__dirname, 'renderedVideos', `final_${storylineId}.mp4`);
    const commandAddMusic = `ffmpeg -i "${transitionOutput}" -i "${musicFilePath}" -filter_complex "[1:a]volume=0.1[music];[0:a][music]amix=inputs=2:duration=first[a]" -map 0:v -map "[a]" -c:v libx264 -shortest "${finalOutputPath}"`;
    execSync(commandAddMusic);

    let key;
    try {
        key = await uploadFinalVideoToS3(storylineId, `final_${storylineId}.mp4`);
        // Cleanup files and directories after successful upload
        const pathsToClean = [
            path.join(__dirname, 'quedVideos'),
            path.join(__dirname, 'renderedVideos'),
            // Add any other paths you want to clean up
        ];
        await cleanMedia(pathsToClean);
    } catch (error) {
        console.error('Failed to upload video or clean up files:', error);
    }
    console.timeEnd('assembleMainMedia');
    
    return key;
};

export default assembleMainMedia;




// export default processImagesToVideo;