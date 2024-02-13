import { execSync } from 'child_process';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { existsSync, mkdirSync, writeFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function convertAudio(downloadPath, audioOutputPath) {
    try {
        const outputDir = dirname(audioOutputPath);
        if (!existsSync(outputDir)) {
            mkdirSync(outputDir, { recursive: true });
        }
        execSync(`ffmpeg -i ${downloadPath} -f flac -acodec flac -ar 16000 -ac 1 ${audioOutputPath}.flac`);
        
        console.log('Audio conversion completed successfully');
    } catch (error) {
        console.error('Error during audio conversion:', error);
    }
}

// Usage
const downloadPath = join(__dirname, '65c4258f3d7b8492b39af61f_20240208005238.webm');
const audioOutputPath = join(__dirname, 'output', 'audio');
convertAudio(downloadPath, audioOutputPath);