import { S3Client, GetObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3";
import { execSync } from 'child_process';
import { createWriteStream, existsSync, mkdirSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { pipeline } from 'stream';
import { promisify } from 'util';
import { fileURLToPath } from 'url';

const order 


// Set the path to the FFmpeg binary included in your deployment package
const ffmpegPath = join(__dirname, 'bin', 'ffmpeg');

export const handler = async (event) => {

// Convert images to video with zoom effect
ffmpeg -loop 1 -i image1.jpg -vf "zoompan=z='zoom+0.001':d=125" -t 5 image1.mp4
ffmpeg -loop 1 -i image2.jpg -vf "zoompan=z='zoom+0.001':d=125" -t 5 image2.mp4

// pre-create list of videos to concatenate



// Assemble list of videos to concatenate

// concantenate videos
ffmpeg -f concat -safe 0 -i mylist.txt -c copy output.mp4

};