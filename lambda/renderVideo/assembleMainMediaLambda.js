import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import processMedia from './processMediaLambda.js';
import createTitleCard from './titleScreenLambda.js';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set the path to the FFmpeg binary included in your deployment package
const ffmpegPath = join(__dirname, 'bin', 'ffmpeg');

const assembleMainMedia = async (storylineId, titleDetails, orderDetails) => {
    console.log('titleDetails', titleDetails.coupleName, titleDetails.marriageDate);
    console.time('assembleMainMedia');

    await createTitleCard(titleDetails.coupleName, titleDetails.marriageDate);
    await processMedia(storylineId, orderDetails);

    const outputDirectory = path.join('/tmp', 'renderedVideos');
    fs.mkdirSync(outputDirectory, { recursive: true });

    const renderingOrderFilePath = '/tmp/BodyClips.txt';
    const concatenatedOutput = path.join('/tmp', 'renderedVideos', `concatenated_${storylineId}.mp4`);
    const commandConcat = `${ffmpegPath} -f concat -safe 0 -i "${renderingOrderFilePath}" -c:v libx264 "${concatenatedOutput}"`;
    execSync(commandConcat);

    const titleCardDuration = 2.5;
    const delayInMillisec = titleCardDuration * 1000;

    const titleCardPath = path.join('/tmp', 'quedVideos', 'titleCard.mp4');
    const transitionOutput = path.join('/tmp', 'transition.mp4');
    const commandTransition = `${ffmpegPath} -i ${titleCardPath} -i ${concatenatedOutput} -filter_complex "[0:v][1:v]xfade=transition=fade:duration=2:offset=2.5[v]; [1:a]adelay=${delayInMillisec}|${delayInMillisec}[delayedaudio]" -map "[v]" -map "[delayedaudio]" -c:v libx264 -pix_fmt yuv420p -c:a aac "${transitionOutput}"`;
    execSync(commandTransition);

    const musicFilePath = path.join('/tmp', titleDetails.musicName);
    const finalOutputPath = path.join('/tmp', 'renderedVideos', `final_${storylineId}.mp4`);
    const commandAddMusic = `${ffmpegPath} -i "${transitionOutput}" -i "${musicFilePath}" -filter_complex "[0:a][1:a]amix=inputs=2:duration=first[a]" -map 0:v -map "[a]" -c:v libx264 -shortest "${finalOutputPath}"`;
    execSync(commandAddMusic);

    console.timeEnd('assembleMainMedia');
};

export default assembleMainMedia;