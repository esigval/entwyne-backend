const express = require('express');
const router = express.Router();
const path = require('path');
const { exec } = require('child_process');
const dotenv = require('dotenv');
const fs = require('fs').promises;  // Use promises API for asynchronous operations

dotenv.config({ path: path.join(__dirname, '../.env') });

const outputPath = path.join(__dirname, '../assets/temp_output/output.webm');
const finalOutput = path.join(__dirname, '../assets/final_output/output.mp4');

router.post('/', (req, res) => {

    async function concatenateVideos(callback) {
        const rawFootagePath = path.join(__dirname, '../assets/rawfootage');
        const videosTxtPath = path.join(__dirname, '../assets/videos.txt');

        try {
            const files = await fs.readdir(rawFootagePath);
            const videoFiles = files.filter(file => path.extname(file) === '.mp4' || path.extname(file) === '.webm');
            const content = videoFiles.map(file => `file '${path.join(rawFootagePath, file)}'`).join('\n');
            await fs.writeFile(videosTxtPath, content, 'utf8');
            
            exec(`ffmpeg -f concat -safe 0 -i ${videosTxtPath} -c copy ${outputPath}`, async (error, stdout, stderr) => {
                if (error) {
                    console.error(`Error concatenating videos: ${error}`);
                    return callback(error);
                }
                console.log('Concatenation of videos finished successfully!');

                // Delete raw footage
                for (const file of videoFiles) {
                    await fs.unlink(path.join(rawFootagePath, file));
                }
                console.log('Raw footage deleted successfully.');

                callback(null);
            });
        } catch (err) {
            console.error(`Error during concatenation: ${err}`);
            return callback(err);
        }
    }

    function convertToMP4(callback) {
        console.log('Starting conversion to mp4...');
        exec(`ffmpeg -i ${outputPath} -c:v libx264 -c:a aac -strict experimental -b:a 192k -shortest ${finalOutput}`, async (error, stdout, stderr) => {
            if (error) {
                console.error(`Error converting to mp4: ${error}`);
                return callback(error);
            }
            console.log('Conversion to mp4 finished successfully!');

            // Delete temp output file
            await fs.unlink(outputPath);
            console.log('Temporary output deleted successfully.');

            callback(null);
        });
    }

    // Execute the functions
    concatenateVideos((err) => {
        if (err) {
            return res.status(500).json({ error: "Error concatenating videos." });
        } else {
            convertToMP4((err) => {
                if (err) {
                    return res.status(500).json({ error: "Error converting to mp4." });
                } else {
                    res.status(200).json({ message: 'Videos processed successfully!' });
                }
            });
        }
    });
});

module.exports = router;
