import fs from 'fs';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const normalizeFile = (inputFile, outputFile) => {
    return new Promise((resolve, reject) => {
        const command = `ffmpeg -i ${inputFile} -c:v libx265 -pix_fmt yuv420p -profile:v main -c:a aac -b:a 192k -ar 44100 ${outputFile}`;
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

    // Construct the FFmpeg command for complex filter concatenation
    const filterComplexParts = normalizedFiles.map((file, index) => `[${index}:v:0][${index}:a:0]`);
    const filterComplex = filterComplexParts.join('') + `concat=n=${normalizedFiles.length}:v=1:a=1[v][a]`;

    const inputFiles = normalizedFiles.map(file => `-i ${file}`).join(' ');

    const command = `ffmpeg ${inputFiles} -filter_complex "${filterComplex}" -map "[v]" -map "[a]" -c:v libx265 -pix_fmt yuv420p -profile:v main -c:a aac -b:a 192k -ar 44100 ${outputPath}`;

    // Run the FFmpeg command to concatenate
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`An error occurred during video concatenation: ${stderr}`);
                reject(error);
            } else {
                console.log(`Video concatenated successfully. Output path: ${outputPath}`);

                // Delete the normalized files
                normalizedFiles.forEach(file => {
                    fs.unlink(file, err => {
                        if (err) {
                            console.error(`Error deleting file ${file}: ${err}`);
                        } else {
                            console.log(`File deleted: ${file}`);
                        }
                    });
                });

                // New code to take a thumbnail of the concatenated video
                const thumbnailPath = outputPath.replace('.mp4', '_thumbnail.jpg');
                const thumbnailCommand = `ffmpeg -ss 00:00:01 -i ${outputPath} -frames:v 1 ${thumbnailPath}`;
                exec(thumbnailCommand, (thumbnailError, thumbnailStdout, thumbnailStderr) => {
                    if (thumbnailError) {
                        console.error(`An error occurred while capturing the thumbnail: ${thumbnailStderr}`);
                        reject(thumbnailError);
                    } else {
                        console.log(`Thumbnail captured successfully. Thumbnail path: ${thumbnailPath}`);
                        resolve({ outputPath, thumbnailPath });
                    }
                });
            }
        });
    });
};

export default concatenateVideos;
