import { execSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import processMedia from './processMedia.js';
import createTitleCard from './titleScreen.js';
import prepareConcateFileText from './preparingConcateFile.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const musicName = 'WistfulMemorable.mp3';
const coupleName = 'John and Jane';
const marriageDate = 'June 25, 2024';

const assembleMainMedia = async (storylineId) => {

    console.time('assembleMainMedia');
    // Assuming processImagesToVideo function handles the conversion of images to videos
    await createTitleCard(coupleName, marriageDate, path.join(__dirname, 'quedVideos'));
    await prepareConcateFileText(storylineId);
    await processMedia(storylineId);

    const renderingOrderFilePath = path.join(__dirname, 'BodyClips.txt');
    const concatenatedOutput = path.join(__dirname, 'renderedVideos', `concatenated_${storylineId}.mp4`);
    const commandConcat = `ffmpeg -f concat -safe 0 -i "${renderingOrderFilePath}" -c:v libx264 "${concatenatedOutput}"`;
    execSync(commandConcat);

    // Forward the title card video by 2.5 seconds
    const titleCardDuration = 2.5; // Duration of the title card video in seconds
    const delayInMillisec = titleCardDuration * 1000;

    const titleCardPath = path.join(__dirname, 'quedVideos', 'titleCard.mp4');
    const transitionOutput = path.join(__dirname, 'transition.mp4');
    const commandTransition = `ffmpeg -i ${titleCardPath} -i ${concatenatedOutput} -filter_complex "[0:v][1:v]xfade=transition=fade:duration=2:offset=2.5[v]; [1:a]adelay=${delayInMillisec}|${delayInMillisec}[delayedaudio]" -map "[v]" -map "[delayedaudio]" -c:v libx264 -pix_fmt yuv420p -c:a aac "${transitionOutput}"`;
    execSync(commandTransition);

    const musicFilePath = path.join(__dirname, 'music', musicName);
    const finalOutputPath = path.join(__dirname, 'renderedVideos', `final_${storylineId}.mp4`);
    const commandAddMusic = `ffmpeg -i "${transitionOutput}" -i "${musicFilePath}" -filter_complex "[0:a][1:a]amix=inputs=2:duration=first[a]" -map 0:v -map "[a]" -c:v libx264 -shortest "${finalOutputPath}"`;
    execSync(commandAddMusic);
    console.timeEnd('assembleMainMedia');
};



assembleMainMedia('65a59778e91d4c46ebf40ed5');




// export default processImagesToVideo;