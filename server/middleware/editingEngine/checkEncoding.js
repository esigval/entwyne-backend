import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dir = path.resolve(__dirname, 'renderedVideos');
const videoFilePath = path.join(dir, 'mainline_65a59778e91d4c46ebf40ed5.mp4');

exec(`ffprobe -v error -select_streams v:0 -show_entries stream=codec_name -of default=noprint_wrappers=1:nokey=1 "${videoFilePath}"`, (error, stdout, stderr) => {
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`Video codec: ${stdout}`);
});
