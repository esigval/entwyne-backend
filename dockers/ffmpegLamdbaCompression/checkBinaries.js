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

checkBinary(ffmpegPath, 'FFmpeg');