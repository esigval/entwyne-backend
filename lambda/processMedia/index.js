import fs from 'fs';
import { exec } from 'child_process';
import path from 'path';
import util from 'util';
const execPromise = util.promisify(exec);
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3';
import { Upload } from '@aws-sdk/lib-storage';
import { createReadStream } from 'fs';

const s3 = new S3Client({ region: 'us-east-1' }); // replace 'us-east-1' with your region

function getStorylineIdFromKey(key) {
  const parts = key.split('/');
  if (parts.length < 3) {
    throw new Error('Invalid key format');
  }
  const storylineId = parts[1];
  return storylineId;
}

async function uploadFileToS3(bucket, key, filePath) {
  const fileStream = createReadStream(filePath);

  const upload = new Upload({
    client: s3,
    params: {
      Bucket: bucket,
      Key: key,
      Body: fileStream
    }
  });

  await upload.done();
}

// Adjusted for Lambda's writable tmp directory
const VIDEOS_DIR = '/tmp/pictures';
const OUTPUT_DIR = '/tmp/output';

// Adjusted path for FFmpeg binary included in the deployment package or Lambda layer
const ffmpegPath = '/bin/ffmpeg';

// Function to download a file from S3
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

// Ensure the output directory exists in /tmp
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Adjusted function to use promises for synchronous execution
async function processVideo(videoPath) {
  const videoName = path.basename(videoPath, path.extname(videoPath));
  const outputVideoPath = path.join(OUTPUT_DIR, `${videoName}.mp4`);

  const ffmpegCommand = `${ffmpegPath} -i "${videoPath}" ` +
    `-c:v libx264 -crf 23 -preset fast -c:a aac -b:a 192k ` +
    `-vf "scale=1920:1080:force_original_aspect_ratio=decrease,pad=1920:1080:(ow-iw)/2:(oh-ih)/2" ` +
    `-r 30 -pix_fmt yuv420p -ar 44100 -ac 2 "${outputVideoPath}"`;

  try {
    console.log(`Processing ${videoPath}...`);
    const { stdout, stderr } = await execPromise(ffmpegCommand);
    console.log(`Processed ${videoPath}, output saved to ${outputVideoPath}`);
  } catch (error) {
    console.error(`Error processing ${videoPath}:`, error);
  }
}

// Example handler function for AWS Lambda
exports.handler = async (event) => {
  // Your logic to populate the VIDEOS_DIR with videos, e.g., download from S3
  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
    const filePath = path.join(VIDEOS_DIR, path.basename(key));
    await downloadFileFromS3(bucket, key, filePath);

    // Process the video
    if (/\.(mp4|avi|webm)$/i.test(filePath)) {
      await processVideo(filePath);
    }

    // Upload the processed video to S3
    const outputFilePath = path.join('/tmp/output', path.basename(filePath));
    const storylineId = getStorylineIdFromKey(key);
    const newKey = `${storylineId}/${path.basename(outputFilePath)}`;

    // Upload the processed video to the S3 bucket
    await uploadFileToS3(process.env.CONCAT_BUCKET, newKey, outputFilePath);
  }
};
