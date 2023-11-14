const express = require('express');
const router = express.Router();
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');
const dotenv = require('dotenv');
const fs = require('fs').promises;  // Use promises API for asynchronous operations
const downloadVideo = require('../utils/downloadStoryFile');
const getOrderedVideoPaths = require('../utils/getOrderedVideoPaths');
const execAsync = promisify(exec); // Promisify exec for async/await use

dotenv.config({ path: path.join(__dirname, '../.env') });

const outputPath = path.join(__dirname, '../assets/temp_output/output.webm');
const finalOutput = path.join(__dirname, '../assets/final_output/output.mp4');

router.post('/', async (req, res) => {
    try {
        const storylineId = 2; // Assuming the ID is passed in the request body
        const videoUrls = await getOrderedVideoPaths(storylineId);
        const rawFootagePath = path.join(__dirname, '../assets/rawfootage');

        let localPaths = [];
        for (let i = 0; i < videoUrls.length; i++) {
            const videoUrl = videoUrls[i];
            const localFilePath = path.join(rawFootagePath, `video_${i}.webm`);
            await downloadVideo(videoUrl, localFilePath); // Download each video to local storage
            localPaths.push(localFilePath); // Keep track of the local file paths
        }

        // Concatenate and convert the videos using local file paths
        await concatenateVideos(localPaths);
        await convertToMP4();

        res.status(200).json({ message: 'Videos processed successfully!' });
    } catch (error) {
        console.error(`Error in video processing: ${error}`);
        res.status(500).send('An error occurred while processing the request.');
    }
});


async function concatenateVideos(localPaths) {
    const videosTxtPath = path.join(__dirname, '../assets/videos.txt');

    const content = localPaths.map(file => `file '${file}'`).join('\n');
    await fs.writeFile(videosTxtPath, content, 'utf8');

    await execAsync(`ffmpeg -f concat -safe 0 -i ${videosTxtPath} -c copy ${outputPath}`);


    // Delete raw footage
    for (const file of localPaths) {
        await fs.unlink(file);
    }
}

async function convertToMP4() {
    await execAsync(`ffmpeg -i ${outputPath} -c:v libx264 -c:a aac -strict experimental -b:a 192k -shortest ${finalOutput}`);
    await fs.unlink(outputPath);
}

module.exports = router;
