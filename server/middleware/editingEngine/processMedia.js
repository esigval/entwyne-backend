import path from 'path';
import util from 'util'; 
import downloadAndSaveFiles from "./downloadMedia.js";
import { execSync, exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const execAsync = util.promisify(exec);

const processMedia = async (storylineId, order) => {
    const mediaFiles = await downloadAndSaveFiles(storylineId, order);
    const images = mediaFiles.imageFiles;
    const videos = mediaFiles.videoFiles;

    const entwynePath = path.join(__dirname, 'assets', 'MadeWithEntwyneDark.png');
    images.push(entwynePath);

    // const ffmpegPath = path.join(__dirname, '../../bin/ffmpeg'); // Change this to your actual ffmpeg path

    const imagePromises = images.map(image => {
        const output = path.join(__dirname, 'quedVideos', `${path.basename(image, path.extname(image))}.mp4`);
        const command = `ffmpeg -loop 1 -i "${image}" \
    -f lavfi -i anullsrc=r=44100:cl=stereo -ar 44100 -ac 2 \
    -filter_complex \
    "[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,boxblur=20:20[blurred]; \
     [0:v]scale=-2:1080:flags=lanczos[fg]; \
     [blurred]pad=1920:1080:(ow-iw)/2:(oh-ih)/2[bg]; \
     [bg][fg]overlay=(W-w)/2:(H-h)/2:shortest=1" \
    -t 5 -c:v libx264 -r 30 -pix_fmt yuv420p "${output}"`;
        return execAsync(command);
    });

    const videoPromises = videos.map(video => {
        const output = path.join(__dirname, 'quedVideos', `${path.basename(video, path.extname(video))}.mp4`);
        const command = `ffmpeg -i "${video}" \
    -c:v libx264 -crf 23 -preset fast -c:a aac -b:a 192k \
    -vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
    -r 30 -pix_fmt yuv420p -ar 44100 -ac 2 "${output}"`;
        return execAsync(command);
    });

    // Wait for all image and video processing to complete
    await Promise.all([...imagePromises, ...videoPromises]);
};

//processMedia('65a59778e91d4c46ebf40ed5');

export default processMedia;
