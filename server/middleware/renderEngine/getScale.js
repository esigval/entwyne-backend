import { execSync } from 'child_process';

// Function to calculate quality based on user settings
function getScale(quality, videoPath) {
    // Use ffprobe to get the width and height of the video
    const ffprobeOutput = execSync(`ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=s=x:p=0 ${videoPath}`);
    const [width, height] = ffprobeOutput.toString().split('x').map(Number);
    console.log(`Width: ${width}, Height: ${height}`);

    // Determine the orientation based on the width and height
    const orientation = width > height ? 'horizontal' : 'vertical';

    const aspectRatio = width / height;
    let scale, absoluteScale;

    switch (quality) {
        case 'SD':
            scale = orientation === 'horizontal' ? 'scale=720:-1' : 'scale=-1:720';
            absoluteScale = orientation === 'horizontal' ? 'scale=720:' + Math.round(720 / aspectRatio) : 'scale:' + Math.round(720 * aspectRatio) + ':720';
            break;
        case 'LowHD':
            scale = orientation === 'horizontal' ? 'scale=1280:-1' : 'scale=-1:1280';
            absoluteScale = orientation === 'horizontal' ? 'scale=1280:' + Math.round(1280 / aspectRatio) : 'scale:' + Math.round(1280 * aspectRatio) + ':1280';
            break;
        case 'HD':
            scale = orientation === 'horizontal' ? 'scale=1920:-1' : 'scale=-1:1920';
            absoluteScale = orientation === 'horizontal' ? 'scale=1920:' + Math.round(1920 / aspectRatio) : 'scale:' + Math.round(1920 * aspectRatio) + ':1920';
            break;
        case 'Proxy':
            scale = orientation === 'horizontal' ? 'scale=720:-1' : 'scale=-1:720';
            absoluteScale = orientation === 'horizontal' ? 'scale=720:' + Math.round(720 / aspectRatio) : 'scale:' + Math.round(720 * aspectRatio) + ':720';
            break;
        default:
            throw new Error('Invalid quality: ' + quality);
    }

    return { scale, absoluteScale, orientation };
}

export default getScale;