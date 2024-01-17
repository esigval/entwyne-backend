import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createTitleCard = async (name, date, outputFolder) => {
    const titleOutputPath = path.join(outputFolder, 'titleCard.mp4');
    const fontPath = './fonts/Allura-Regular.ttf';

    // Prepare the drawtext parameters
    const drawTextName = `drawtext=fontfile=${fontPath}:text='${name}':fontcolor=white:fontsize=78:x=(w-text_w)/2:y=(h-text_h)/2-100`;
    const drawTextDate = `drawtext=fontfile=${fontPath}:text='${date}':fontcolor=white:fontsize=36:x=(w-text_w)/2:y=(h-text_h)/2+50`;

    // FFMPEG command to create a title card with two levels of text
    const command = `ffmpeg -f lavfi -i color=c=black:s=1920x1080:d=5 -f lavfi -i anullsrc=r=44100:cl=stereo -vf "[in]${drawTextName}, ${drawTextDate}[out]" -pix_fmt yuv420p -c:v libx264 -c:a aac -shortest -r 30 -video_track_timescale 15360 ${titleOutputPath}`;

    // Execute the command
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.error(`FFMPEG Error: ${stderr}`);
        }
        console.log('Title card creation complete');
    });
};

export default createTitleCard;

// Usage Example
// createTitleCard('John and Jane', 'June 25, 2024', path.join(__dirname, 'quedVideos'));