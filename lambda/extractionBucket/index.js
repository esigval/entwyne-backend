import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { execSync } from 'child_process';
import { createWriteStream, existsSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

// Construct __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const s3Client = new S3Client({ region: "us-east-1" });
const streamPipeline = promisify(pipeline);

// Set the path to the FFmpeg binary included in your deployment package
const ffmpegPath = join(__dirname, 'bin', 'ffmpeg');

export const handler = async (event) => {
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));

    const extension = key.split('.').pop();
    const baseName = key.replace(`video/`, '').replace(`.${extension}`, '');

    const downloadPath = `/tmp/${key}`;
    const thumbnailPath = `/tmp/${baseName}.jpg`; // Path for thumbnail
    const audioOutputPath = `/tmp/${baseName}.mp3`; // Path for audio file

    try {
        // Ensure the download directory exists
        const downloadDirectory = dirname(downloadPath);
        if (!existsSync(downloadDirectory)) {
            mkdirSync(downloadDirectory, { recursive: true });
        }

        console.log(`Downloading video from S3: ${bucket}/${key}`);
        const getObjectParams = { Bucket: bucket, Key: key };
        const command = new GetObjectCommand(getObjectParams);
        const { Body } = await s3Client.send(command);

        const downloadStream = createWriteStream(downloadPath);
        await streamPipeline(Body, downloadStream);
        console.log("Video downloaded successfully");

        // Extract thumbnail
        console.log("Starting FFmpeg to create thumbnail");
        execSync(`${ffmpegPath} -i ${downloadPath} -ss 00:00:01 -frames:v 1 ${thumbnailPath}`);
        console.log("Thumbnail creation successful");

        // Extract audio
        console.log("Starting FFmpeg to extract audio");
        execSync(`${ffmpegPath} -i ${downloadPath} -q:a 0 -map a ${audioOutputPath}`);
        console.log("Audio extraction successful");

        // Upload thumbnail
        await uploadFileToS3(thumbnailPath, `thumbnails/${baseName}.jpg`, 'image/jpeg');

        // Upload audio file
        await uploadFileToS3(audioOutputPath, `audio/${baseName}.mp3`, 'audio/mpeg');

    } catch (error) {
        console.error("Error processing file:", error);
        // Handle error as needed
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Thumbnail and audio processing complete'),
    };
};

async function uploadFileToS3(filePath, s3Key, contentType) {
    console.log(`Reading file from path: ${filePath}`);
    if (existsSync(filePath)) {
        const fileBuffer = readFileSync(filePath);
        console.log("File read successfully, preparing to upload");

        console.log(`Uploading file to S3: ${s3Key}`);
        const putObjectParams = {
            Bucket: 'twynes-post',
            Key: s3Key,
            Body: fileBuffer,
            ContentType: contentType
        };
        const putCommand = new PutObjectCommand(putObjectParams);
        await s3Client.send(putCommand);
        console.log("File uploaded successfully to S3");
    } else {
        console.log("File not found after FFmpeg execution");
    }
}
