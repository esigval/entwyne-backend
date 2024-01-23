import renderingOrder from "./renderingOrder.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prepareConcateFileText = async (order) => {
    let bodyFileList = "";

    order.forEach((item) => {
        let filePath;
        const extension = path.extname(item.filePath);

        if (item.mediaType.startsWith('image')) {
            filePath = `${item._id.toString()}.mp4`;
        } else if (item.mediaType.startsWith('video')) {
            filePath = `${item._id.toString()}.mp4`;
        }

        bodyFileList += `file '${filePath}'\n`;
    });

    const madeWithEntwynePath = 'MadeWithEntwyneDark.mp4';
    bodyFileList += `file '${madeWithEntwynePath}'\n`;

    const bodyFilePath = path.join(__dirname, 'quedVideos', 'BodyClips.txt');
    // Check if the directory exists
    const directoryPath = path.dirname(bodyFilePath);
    if (!fs.existsSync(directoryPath)) {
        fs.mkdirSync(directoryPath, { recursive: true });
    }

    // Check if the file exists
    if (!fs.existsSync(bodyFilePath)) {
        fs.writeFileSync(bodyFilePath, '', 'utf8');
    }

    // Write the bodyFileList to the file
    fs.writeFileSync(bodyFilePath, bodyFileList, 'utf8');
};

// Usage

export default prepareConcateFileText;