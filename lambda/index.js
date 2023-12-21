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


    const downloadPath = `/tmp/${key}`;
    const baseName = key.replace('video/', '').replace('.mp4', '');
    const thumbnailPath = `/tmp/${baseName}.jpg`; // Ensure the path ends with .jpg
    console.log(`Thumbnail Path: ${thumbnailPath}`);

    try {
        // Ensure the download directory exists
        const downloadDirectory = dirname(downloadPath);
        if (!existsSync(downloadDirectory)) {
            mkdirSync(downloadDirectory, { recursive: true });
        }

        // Ensure the thumbnail directory exists
        const thumbnailDirectory = dirname(thumbnailPath);
        if (!existsSync(thumbnailDirectory)) {
            mkdirSync(thumbnailDirectory, { recursive: true });
        }

        console.log(`Downloading video from S3: ${bucket}/${key}`);
        console.log(`Thumbnail Path: ${thumbnailPath}`);
        const getObjectParams = { Bucket: bucket, Key: key };
        const command = new GetObjectCommand(getObjectParams);
        const { Body } = await s3Client.send(command);

        const downloadStream = createWriteStream(downloadPath);
        await streamPipeline(Body, downloadStream);
        console.log("Video downloaded successfully");

        console.log("Starting FFmpeg to create thumbnail");
        execSync(`${ffmpegPath} -i ${downloadPath} -ss 00:00:01 -frames:v 1 ${thumbnailPath}`);
        console.log("Thumbnail creation successful");

        console.log(`Reading thumbnail from path: ${thumbnailPath}`);
        if (existsSync(thumbnailPath)) {
            const thumbnailBuffer = readFileSync(thumbnailPath);
            console.log("Thumbnail read successfully, preparing to upload");

            const thumbnailKey = `thumbnails/${baseName}.jpg`;  // Correct way to construct the S3 key


            console.log("Uploading thumbnail to S3");
            const putObjectParams = {
                Bucket: 'twynes-post',
                Key: thumbnailKey,
                Body: thumbnailBuffer,
                ContentType: 'image/jpeg'
            };
            const putCommand = new PutObjectCommand(putObjectParams);
            await s3Client.send(putCommand);
            console.log("Thumbnail uploaded successfully to S3");
        } else {
            console.log("Thumbnail file not found after FFmpeg execution");
        }
    } catch (error) {
        console.error("Error processing file:", error);
        // Handle error as needed
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Thumbnail processing complete'),
    };
};
