import path from 'path';
import downloadAndSaveFiles from "./downloadMediaLambda.js";
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';
import { join, dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Set the path to the FFmpeg binary included in your deployment package
const ffmpegPath = join(__dirname, 'bin', 'ffmpeg');

const processMedia = async (storylineId, orderDetails) => {
    const mediaFiles = await downloadAndSaveFiles(storylineId, orderDetails);
    const images = mediaFiles.imageFiles;
    const videos = mediaFiles.videoFiles;

    const entwynePath = path.join(__dirname, 'assets', 'MadeWithEntwyneDark.png');
    images.push(entwynePath);

    images.forEach((image) => {
        const output = path.join('/tmp', 'quedVideos', `${path.basename(image, path.extname(image))}.mp4`);
        const command = `${ffmpegPath} -loop 1 -i "${image}" \
-f lavfi -i anullsrc=r=44100:cl=stereo -ar 44100 -ac 2 \
-filter_complex \
"[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,boxblur=20:20[blurred]; \
 [0:v]scale=-2:1080:flags=lanczos[fg]; \
 [blurred]pad=1920:1080:(ow-iw)/2:(oh-ih)/2[bg]; \
 [bg][fg]overlay=(W-w)/2:(H-h)/2:shortest=1" \
-t 5 -c:v libx264 -pix_fmt yuv420p "${output}"`;
        execSync(command);
    });



    videos.forEach((video) => {
        const output = path.join('/tmp', 'quedVideos', `${path.basename(video, path.extname(video))}.mp4`);
        const command = `${ffmpegPath} -i "${video}" \
-c:v libx264 -crf 23 -preset fast -c:a aac -b:a 192k \
-vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" \
-pix_fmt yuv420p -ar 44100 -ac 2 "${output}"`;
        execSync(command);
    });
};

export default processMedia;
