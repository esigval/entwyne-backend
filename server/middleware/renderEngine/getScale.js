import { execSync } from 'child_process';

// Function to calculate quality based on user settings
function getScale(quality, videoPath) {
    // Use ffprobe to get the width and height of the video
    const ffprobeOutput = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 ${videoPath}`);
    const [width, height] = ffprobeOutput.toString().split('x').map(Number);

    // Determine the orientation based on the width and height
    const orientation = width > height ? 'horizontal' : 'vertical';

    switch (quality) {
        case 'SD':
            return orientation === 'horizontal' ? 'scale=720:-2' : 'scale=-2:720';
        case 'LowHD':
            return orientation === 'horizontal' ? 'scale=1280:-2' : 'scale=-2:1280';
        case 'HD':
            return orientation === 'horizontal' ? 'scale=1920:-2' : 'scale=-2:1920';
        case 'Proxy':
            return orientation === 'horizontal' ? 'scale=720:-2' : 'scale=-2:720';
        default:
            throw new Error('Invalid quality: ' + quality);
    }
}

export default getScale;