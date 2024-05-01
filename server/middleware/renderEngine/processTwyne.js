import fs from 'fs';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const concatenateVideos = (fileLocations, outputPath = 'output.mp4') => {
    
    // Sort the file locations based on the index number after the first underscore in the filename
    fileLocations.sort((a, b) => {
        const filenameA = a.split('/').pop();
        const filenameB = b.split('/').pop();
        const indexA = parseInt(filenameA.split('_')[1], 10);
        const indexB = parseInt(filenameB.split('_')[1], 10);
        return indexA - indexB;
    });
    
    
    // Create a text file that lists all the files to be concatenated
    const listFile = path.join(__dirname, 'list.txt');
    fs.writeFileSync(listFile, fileLocations.map(file => `file '${file}'`).join('\n'));

    // Run the FFmpeg command
    const command = `ffmpeg -f concat -safe 0 -i ${listFile} -c:v libx265 -pix_fmt yuv420p -profile:v main ${outputPath}`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`An error occurred during video concatenation: ${error}`);
        } else {
            console.log(`Video concatenated successfully. Output path: ${outputPath}`);
        }
    });
}

export default concatenateVideos;