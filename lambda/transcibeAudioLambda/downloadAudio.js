import { S3 } from '@aws-sdk/client-s3';
import { createWriteStream } from "fs";
import { join } from "path";
import { pipeline } from 'stream';
import { promisify } from 'util';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Initialize AWS S3 client
const s3 = new S3();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const bucketName = 'twynes-post';
const originalKey = 'audio/audio.flac';

const downloadPath = join(__dirname, "my-media-file.flac");

export default async function downloadFile() {
    const { Body } = await s3.getObject({ Bucket: bucketName, Key: originalKey });
    await promisify(pipeline)(Body, createWriteStream(downloadPath));
    return downloadPath;
}