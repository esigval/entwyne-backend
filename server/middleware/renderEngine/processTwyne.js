import fs from 'fs';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const normalizeFile = (inputFile, outputFile) => {
    return new Promise((resolve, reject) => {
        const command = `ffmpeg -i ${inputFile} -c:v libx264 -pix_fmt yuv420p -profile:v main -vf "scale=720:480,setsar=1" -c:a aac -b:a 192k -ar 44100 ${outputFile}`;
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error normalizing file ${inputFile}: ${stderr}`);
                reject(error);
            } else {
                console.log(`File normalized: ${outputFile}`);
                resolve(outputFile);
            }
        });
    });
};

const concatenateVideos = async (fileLocations, outputPath = 'output.mp4') => {
    // Sort the file locations based on the index number after the first underscore in the filename
    fileLocations.sort((a, b) => {
        const filenameA = a.split('/').pop();
        const filenameB = b.split('/').pop();
        const indexA = parseInt(filenameA.split('_')[1], 10);
        const indexB = parseInt(filenameB.split('_')[1], 10);
        return indexA - indexB;
    });

    // Normalize all files
    const normalizedFiles = await Promise.all(fileLocations.map((file, index) => {
        const normalizedFile = path.join(__dirname, `normalized_${index}.mp4`);
        return normalizeFile(file, normalizedFile);
    }));

    // Create a text file that lists all the normalized files to be concatenated
    const listFile = path.join(__dirname, 'list.txt');
    fs.writeFileSync(listFile, normalizedFiles.map(file => `file '${file}'`).join('\n'));

    // Run the FFmpeg command to concatenate
    const command = `ffmpeg -f concat -safe 0 -i ${listFile} -c:v libx264 -pix_fmt yuv420p -profile:v main -c:a aac -b:a 192k -ar 44100 ${outputPath}`;
    exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`An error occurred during video concatenation: ${stderr}`);
        } else {
            console.log(`Video concatenated successfully. Output path: ${outputPath}`);

            // Delete the normalized files and the list file
            normalizedFiles.forEach(file => {
                fs.unlink(file, err => {
                    if (err) {
                        console.error(`Error deleting file ${file}: ${err}`);
                    } else {
                        console.log(`File deleted: ${file}`);
                    }
                });
            });
            fs.unlink(listFile, err => {
                if (err) {
                    console.error(`Error deleting file ${listFile}: ${err}`);
                } else {
                    console.log(`File deleted: ${listFile}`);
                }
            });
        }
    });
};

export default concatenateVideos;
