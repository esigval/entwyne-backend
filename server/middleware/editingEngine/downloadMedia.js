import fs from 'fs';
import axios from 'axios';
import path from 'path';
import renderingOrder from './renderingOrder.js';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


const downloadFile = async (url, filePath) => {

    try {
        const response = await axios({
            url,
            method: 'GET',
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(filePath);
        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', resolve);
            writer.on('error', reject);
        });
    } catch (error) {
        console.error(`Error downloading file from ${url}:`, error);
        throw error;
    }
};

const ensureDirectoryExists = (dirPath) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

const downloadAndSaveFiles = async (storylineId) => {
    const order = await renderingOrder(storylineId);
    const videoDir = path.join(__dirname, 'quedVideos');
    const imageDir = path.join(__dirname, 'images');

    ensureDirectoryExists(videoDir); // Ensure the video directory exists
    ensureDirectoryExists(imageDir); // Ensure the image directory exists

    const videoFiles = [];
    const imageFiles = [];

    const downloadPromises = order.map((item) => {
        let localFilePath;
        const extension = path.extname(item.filePath);
        if (item.mediaType.startsWith('video')) {
            localFilePath = path.join(videoDir, `${item._id.toString()}${extension}`);
            videoFiles.push(localFilePath);
        } else if (item.mediaType.startsWith('image')) {
            localFilePath = path.join(imageDir, `${item._id.toString()}${extension}`);
            imageFiles.push(localFilePath);
        } else {
            // Skip if mediaType is neither video nor supported image format
            return Promise.resolve();
        }

        console.log(`Downloading and saving from ${item.filePath} to ${localFilePath}`);
        return downloadFile(item.filePath, localFilePath);
    });

    await Promise.all(downloadPromises);

    console.log('All files downloaded and saved.');
    return { videoFiles, imageFiles };

};

export default downloadAndSaveFiles;