const AWS = require('aws-sdk');
const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');

const s3 = new AWS.S3();
const ffmpegPath = '/usr/bin/ffmpeg';
const ffprobePath = '/usr/bin/ffprobe';

// Define the constants manually if they are not available
const F_OK = fs.constants ? fs.constants.F_OK : 0;
const X_OK = fs.constants ? fs.constants.X_OK : 1;

const checkBinary = async (binaryPath, binaryName) => {
    try {
        // First, check if the binary exists and is executable
        await fs.access(binaryPath, F_OK | X_OK);
        console.log(`${binaryName} binary exists and is executable.`);

        // For FFmpeg, use "-version"; for FFprobe, you can also use "-version".
        const command = `${binaryPath} -version`;
        const output = await new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    console.error(`${binaryName} execution error:`, stderr);
                    return reject(`${binaryName} is not accessible or not working`);
                }
                console.log(`${binaryName} version:`, stdout.split('\n')[0]); // Log the first line to get the version
                resolve(stdout);
            });
        });
        return true; // Binary exists, is executable, and is working
    } catch (error) {
        console.error(`${binaryName} binary does not exist, is not executable, or is not working:`, error);
        return false; // Binary does not exist, is not executable, or is not working
    }
};

const getVideoDetails = async (filePath) => {
    try {
        const command = `${ffprobePath} -v error -show_entries stream=codec_type,duration,width,height -of default=noprint_wrappers=1 "${filePath}"`;
        const output = await new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    return reject(`FFprobe execution failed: ${stderr}`);
                }
                resolve(stdout);
            });
        });

        const hasAudio = output.includes('codec_type=audio');

        const durationMatch = output.match(/duration=([\d.]+)/);
        const duration = durationMatch ? parseFloat(durationMatch[1]) : null;

        const widthMatch = output.match(/width=(\d+)/);
        const heightMatch = output.match(/height=(\d+)/);
        const width = widthMatch ? parseInt(widthMatch[1], 10) : null;
        const height = heightMatch ? parseInt(heightMatch[1], 10) : null;

        return {
            hasAudio,
            duration,
            width,
            height
        };
    } catch (error) {
        console.error('Error getting video details:', error);
        return {
            hasAudio: false,
            duration: null,
            width: null,
            height: null
        };
    }
};

const createSilentAudioTrack = async (videoPath, audioOutputPath) => {
    try {
        const videoDetails = await getVideoDetails(videoPath);
        const duration = videoDetails.duration;
        const hasAudio = videoDetails.hasAudio;

        if (hasAudio) {
            console.log("Video already has an audio track.");
            return false;
        }

        const generateSilentAudioCommand = `${ffmpegPath} -f lavfi -i anullsrc=r=44100:cl=stereo -t ${duration} "${audioOutputPath}"`;
        await new Promise((resolve, reject) => {
            exec(generateSilentAudioCommand, (error, stdout, stderr) => {
                if (error) {
                    return reject(`Error creating silent audio track: ${stderr}`);
                }
                console.log(`Silent audio file is saved to: ${audioOutputPath}`);
                resolve(stdout);
            });
        });

        return true;
    } catch (error) {
        console.error("Error creating silent audio track:", error);
        return false;
    }
};

const extractAudio = async (input, audioOutput) => {
    const command = `${ffmpegPath} -i "${input}" -acodec pcm_s16le -ar 16000 "${audioOutput}"`;
    console.log('Extracting audio from:', input, 'to:', audioOutput);

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(`Error extracting audio: ${stderr}`);
            }
            resolve(stdout);
        });
    });
};

const extractThumbnail = async (input, thumbnailOutputUri) => {
    try {
        console.log(`Extracting thumbnail from: ${input} to: ${thumbnailOutputUri}`);
        const command = `${ffmpegPath} -i "${input}" -ss 00:00:01 -vframes 1 -vf scale=-1:240 -c:v png -update 1 "${thumbnailOutputUri}"`;

        await new Promise((resolve, reject) => {
            exec(command, (error, stdout, stderr) => {
                if (error) {
                    return reject(`Error extracting thumbnail: ${stderr}`);
                }
                console.log('Thumbnail extraction completed successfully');
                resolve(stdout);
            });
        });
    } catch (error) {
        console.error('An error occurred during thumbnail extraction:', error);
        throw error;
    }
};

const compressVideo = async (input, output, quality, orientation) => {
    let scale;

    switch (quality) {
        case 'SD':
            scale = orientation === 'horizontal' ? 'scale=720:-2' : 'scale=-2:720';
            break;
        case 'LowHD':
            scale = orientation === 'horizontal' ? 'scale=1280:-2' : 'scale=-2:1280';
            break;
        case 'HD':
            scale = orientation === 'horizontal' ? 'scale=1920:-2' : 'scale=-2:1920';
            break;
        case 'Proxy':
            scale = orientation === 'horizontal' ? 'scale=720:-2' : 'scale=-2:720';
            break;
        default:
            throw new Error('Invalid quality: ' + quality);
    }

    const command = `${ffmpegPath} -i "${input}" -vf "${scale},fps=30" -vcodec libx264 -preset ultrafast -ar 16000 "${output}"`;
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                return reject(`Compression failed for quality ${quality}: ${stderr}`);
            }
            resolve(stdout);
        });
    });
};

module.exports = {
    getVideoDetails,
    createSilentAudioTrack,
    extractAudio,
    extractThumbnail,
    compressVideo,
    checkBinary
};


/*getVideoDetails('/usr/video/test.mp4').then(console.log).catch(console.error);
// createSilentAudioTrack('/usr/video/test.mp4', '/usr/video/output_silent.mp3').then(console.log).catch(console.error);
extractAudio('/usr/video/test.mp4', '/usr/video/output_audio.wav').then(console.log).catch(console.error);
extractThumbnail('/usr/video/test.mp4', '/usr/video/output_thumbnail.png').then(console.log).catch(console.error);
compressVideo('/usr/video/test.mp4', '/usr/video/output_compressed.mp4', 'Proxy', 'horizontal').then(console.log).catch(console.error);
*/