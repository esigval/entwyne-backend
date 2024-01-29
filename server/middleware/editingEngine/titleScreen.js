import { createCanvas, registerFont } from 'canvas';
import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const createTitleCard = async (name, date, outputFolder) => {
    const width = 1920;
    const height = 1080;

    // Register font
    const fontPath = path.join(__dirname, 'fonts/Allura-Regular.ttf');
    registerFont(fontPath, { family: 'Allura-Regular' });


    // Create canvas and context after registering the font
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Background color
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, width, height);




    // Font settings
    ctx.font = '78px "Allura-Regular"';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';

    // Draw text
    ctx.fillText(name, width / 2, height / 2 - 100);
    ctx.font = '36px "Allura-Regular"';
    ctx.fillText(date, width / 2, height / 2 + 50);

    // Save the image
    const imagePath = path.join(outputFolder, 'titleCard.jpg');
    const buffer = canvas.toBuffer('image/jpeg');
    fs.writeFileSync(imagePath, buffer);

    // Convert image to video using FFmpeg
    const titleOutputPath = path.join(outputFolder, 'titleCard.mp4');
    // const ffmpegPath = path.join(__dirname, '../../bin/ffmpeg'); // Adjust your ffmpeg path
    const ffmpegCommand = `ffmpeg -loop 1 -i ${imagePath} -vf "scale=in_range=jpeg:out_range=mpeg,format=yuv420p" -t 5 -c:v libx264 -r 30 ${titleOutputPath}`;


    exec(ffmpegCommand, (error, stdout, stderr) => {
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
