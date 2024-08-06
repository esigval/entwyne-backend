import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Directory containing the final video files
const finalsDir = path.join(__dirname, 'finals');

// Output file for the probe results
const outputFile = path.join(__dirname, 'probeResults.json');

const probeVideo = (filePath) => {
    return new Promise((resolve, reject) => {
        exec(`ffprobe -v quiet -print_format json -show_format -show_streams "${filePath}"`, (err, stdout, stderr) => {
            if (err) {
                reject(`Error probing ${filePath}: ${stderr}`);
            } else {
                resolve({ filePath, metadata: JSON.parse(stdout) });
            }
        });
    });
};

const probeAllVideos = async (specificFilePath) => {
    try {
        let files;
        if (specificFilePath) {
            files = [specificFilePath];
        } else {
            files = fs.readdirSync(finalsDir).filter(file => path.extname(file) === '.mp4').map(file => path.join(finalsDir, file));
        }

        const probePromises = files.map(file => probeVideo(file));
        const results = await Promise.all(probePromises);
        fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), 'utf-8');

        console.log(`Probing completed. Results saved to ${outputFile}`);
    } catch (error) {
        console.error(`Error probing videos: ${error.message}`);
    }
};

// Specific video file path
const specificVideoFilePath = path.join(__dirname, '66b298659507955a0b52c6fe.mp4');

// Probe the specific video file
probeAllVideos(specificVideoFilePath);