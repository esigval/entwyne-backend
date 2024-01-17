import renderingOrder from "./renderingOrder.js";
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const prepareConcateFileText = async (storylineId) => {

    const order = await renderingOrder(storylineId);

    let bodyFileList = "";

    order.forEach((item) => {
        let filePath;
        const extension = path.extname(item.filePath);
    
        if (item.mediaType.startsWith('image')) {
            filePath = `quedVideos/${item._id.toString()}.mp4`;
        } else if (item.mediaType.startsWith('video')) {
            filePath = `quedVideos/${item._id.toString()}.mp4`;
        }
        
        bodyFileList += `file '${filePath}'\n`;
    });

    const madeWithEntwynePath = 'quedVideos/MadeWithEntwyne.mp4';
    bodyFileList += `file '${madeWithEntwynePath}'\n`;

    const bodyFilePath = `${__dirname}/BodyClips.txt`;
    fs.writeFileSync(bodyFilePath, bodyFileList);
};

// Usage

export default prepareConcateFileText;