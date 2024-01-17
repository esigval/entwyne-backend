import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const updateConcatFile = async (baseDir, transitionVideoPath) => {
    const concatFilePath = path.join(baseDir, 'BodyClips.txt');

    // Read the existing content of BodyClips.txt
    let fileContent = '';
    if (fs.existsSync(concatFilePath)) {
        fileContent = fs.readFileSync(concatFilePath, 'utf8');
    }

    // Convert absolute transition video path to a relative path
    const relativeTransitionVideoPath = path.relative(baseDir, transitionVideoPath);

    // Prepare the line to add for the transition video
    const transitionVideoLine = `file '${relativeTransitionVideoPath.replace(/\\/g, '/')}'\n`;

    // Prepend the transition video line to the existing content
    const updatedContent = transitionVideoLine + fileContent;

    // Write the updated content back to BodyClips.txt
    fs.writeFileSync(concatFilePath, updatedContent, 'utf8');
};


export default updateConcatFile;

// Usage
//const rootDir = __dirname; // Assuming __dirname is your root directory
//const transitionVideoPath = path.join(rootDir, 'transition.mp4');
// updateConcatFile(rootDir, transitionVideoPath);
