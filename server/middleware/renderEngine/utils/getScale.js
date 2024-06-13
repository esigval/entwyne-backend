import { execSync } from 'child_process';

function getScale(quality, videoPath, twyneOrientation) {
    // Use ffprobe to get the width, height, and duration of the video
    const ffprobeOutput = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height,duration -of csv=s=x:p=0 ${videoPath}`);
    const [width, height, durationStr] = ffprobeOutput.toString().trim().split('x').map((value, index) => index < 2 ? Number(value) : parseFloat(value));

    // Determine the orientation based on the width and height
    const orientation = width > height ? 'horizontal' : 'vertical';
    const aspectRatio = width / height;

    let targetScale, absoluteScale;

    // Determine target dimensions based on quality
    let targetWidth, targetHeight;
    switch (quality) {
        case 'SD':
        case 'Proxy':
            targetWidth = 720;
            targetHeight = 480;
            break;
        case 'LowHD':
            targetWidth = 1280;
            targetHeight = 720;
            break;
        case 'HD':
            targetWidth = 1920;
            targetHeight = 1080;
            break;
        default:
            throw new Error('Invalid quality: ' + quality);
    }

    if (twyneOrientation === 'horizontal') {
        targetScale = orientation === 'horizontal' ? `scale=${targetWidth}:-1` : `scale=-1:${targetHeight}`;
        absoluteScale = orientation === 'horizontal' 
            ? `scale=${targetWidth}:${Math.round(targetWidth / aspectRatio)}` 
            : `scale=${Math.round(targetHeight * aspectRatio)}:${targetHeight}`;
    } else {
        targetScale = orientation === 'vertical' ? `scale=-1:${targetHeight}` : `scale=${targetWidth}:-1`;
        absoluteScale = orientation === 'vertical' 
            ? `scale=${Math.round(targetHeight * aspectRatio)}:${targetHeight}`
            : `scale=${targetWidth}:${Math.round(targetWidth / aspectRatio)}`;
    }

    // Duration in seconds
    const duration = durationStr;

    return { targetScale, absoluteScale, orientation, duration };
}

export default getScale;