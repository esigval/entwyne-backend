import fs from 'fs';
import { S3, GetObjectCommand } from '@aws-sdk/client-s3';
import path from 'path';
import { Readable } from 'stream';


const s3 = new S3();

const downloadFileFromS3 = async (bucket, key, downloadPath) => {
    const params = {
        Bucket: bucket,
        Key: key,
    };

    const command = new GetObjectCommand(params);

    const data = await s3.send(command);

    const file = fs.createWriteStream(downloadPath);

    return new Promise((resolve, reject) => {
        data.Body.pipe(file)
            .on('error', reject)
            .on('finish', () => {
                console.log(`File downloaded successfully to ${downloadPath}`);
                resolve();
            });
    });
};

const getMusicFile = async (musicName) => {
    const bucket = 'music-tracks';
    const musicFileKey = `${musicName}`; // assuming the music file name is the same as musicName
    console.log('musicFileKey', musicFileKey);

    const musicFilePath = path.join('/tmp', musicFileKey);

    await downloadFileFromS3(bucket, musicFileKey, musicFilePath);
};

const logFileContents = (filePath) => {
    if (fs.existsSync(filePath)) {
        const contents = fs.readFileSync(filePath, 'utf8');
        console.log(`Contents of ${filePath}:`);
        console.log(contents);
    } else {
        console.log(`File ${filePath} does not exist.`);
    }
};

const getBodyClips = async (storylineId) => {
    const bucket = 'twynes-post';
    const bodyClipKey = `storylines/${storylineId}/BodyClips.txt`;
    console.log('bodyClipKey', bodyClipKey);

    const bodyClipPath = path.join('/tmp', 'BodyClips.txt');

    await downloadFileFromS3(bucket, bodyClipKey, bodyClipPath);
    console.log('bodyClipPath', bodyClipPath);

    logFileContents(bodyClipPath); // Log the contents of the file
};


const getAssets = async (storylineId, musicName) => {
    await getBodyClips(storylineId);
    await getMusicFile(musicName);
};

export default getAssets;