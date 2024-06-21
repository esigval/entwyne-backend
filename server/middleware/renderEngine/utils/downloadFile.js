import universalPreSignedUrl from '../../presignedUrls/universalPreSignedUrl.js'; // adjust the import path as necessary
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function downloadFile(bucketName, key, outputPath) {
    try {
        const getSignedUrl = universalPreSignedUrl(bucketName);
        const presignedUrl = await getSignedUrl('getObject', key);

        const response = await axios({
            method: 'GET',
            url: presignedUrl,
            responseType: 'stream'
        });

        const writer = fs.createWriteStream(outputPath);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                //console.log('Download complete.');
                resolve();
            });
            writer.on('error', (error) => {
                console.error("Error writing file:", error);
                reject(error);
            });
        });
    } catch (error) {
        console.error("Error downloading the file:", error.message);
        // Optionally rethrow or handle the error accordingly
    }
}

export default downloadFile;