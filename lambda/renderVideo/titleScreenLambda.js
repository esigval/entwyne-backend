import { exec } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set the path to the FFmpeg binary included in your deployment package
const ffmpegPath = join(__dirname, 'bin', 'ffmpeg');

const createTitleCard = (name, date) => {
    return new Promise((resolve, reject) => {
        const outputFolder = path.join('/tmp', 'quedVideos');
        fs.mkdirSync(outputFolder, { recursive: true });
        const titleOutputPath = path.join(outputFolder, 'titleCard.mp4');
        const fontPath = path.join(__dirname, 'fonts', 'Allura-Regular.ttf');


        const drawTextName = `drawtext=fontfile=${fontPath}:text='${name}':fontcolor=white:fontsize=78:x=(w-text_w)/2:y=(h-text_h)/2-100`;
        const drawTextDate = `drawtext=fontfile=${fontPath}:text='${date}':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=(h-text_h)/2+50`;

        const command = `${ffmpegPath} -f lavfi -i color=c=black:s=1920x1080:d=5 -f lavfi -i anullsrc=r=44100:cl=stereo -vf "[in]${drawTextName}, ${drawTextDate}[out]" -pix_fmt yuv420p -c:v libx264 -c:a aac -shortest -r 30 -video_track_timescale 15360 ${titleOutputPath}`;

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error: ${error.message}`);
                reject(error);
            }
            if (stderr) {
                console.error(`FFMPEG Error: ${stderr}`);
            }
            console.log('Title card creation complete');
            resolve(titleOutputPath);
        });
    });
};


export default createTitleCard;