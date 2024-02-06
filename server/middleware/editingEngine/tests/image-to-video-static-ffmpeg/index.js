const fs = require('fs');
const { exec } = require('child_process');
const path = require('path');
const util = require('util');
const execPromise = util.promisify(exec);
const { S3, GetObjectCommand } = require('@aws-sdk/client-s3'); // Import AWS SDK for JavaScript v3 modules

// Create an S3 client
const s3 = new S3();

// Adjusted for Lambda's writable tmp directory
const IMAGES_DIR = '/tmp/pictures';
const OUTPUT_DIR = '/tmp/output';

// Adjusted path for FFmpeg binary included in the deployment package or Lambda layer
const ffmpegPath = '/bin/ffmpeg'; // Assuming FFmpeg binary is placed in /opt directory of Lambda layer

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
async function processImage(imagePath) {
  const imageName = path.basename(imagePath, path.extname(imagePath));
  const outputVideoPath = path.join(OUTPUT_DIR, `${imageName}.mp4`);

  const ffmpegCommand = `${ffmpegPath} -loop 1 -i "${imagePath}" ` +
    `-f lavfi -i anullsrc=r=44100:cl=stereo -ar 44100 -ac 2 ` +
    `-filter_complex ` +
    `"[0:v]scale=1920:1080:force_original_aspect_ratio=decrease,boxblur=20:20[blurred]; ` +
    `[0:v]scale=-2:1080:flags=lanczos[fg]; ` +
    `[blurred]pad=1920:1080:(ow-iw)/2:(oh-ih)/2[bg]; ` +
    `[bg][fg]overlay=(W-w)/2:(H-h)/2:shortest=1" ` +
    `-t 5 -c:v libx264 -r 30 -pix_fmt yuv420p "${outputVideoPath}"`;

  try {
    console.log(`Processing ${imagePath}...`);
    const { stdout, stderr } = await execPromise(ffmpegCommand);
    console.log(`Processed ${imagePath}, output saved to ${outputVideoPath}`);
  } catch (error) {
    console.error(`Error processing ${imagePath}:`, error);
  }
}

// Example handler function for AWS Lambda
exports.handler = async (event) => {
  // Your logic to populate the IMAGES_DIR with images, e.g., download from S3
  for (const file of event.files) {
    const filePath = path.join(IMAGES_DIR, file.name);
    await downloadFileFromS3(file.bucket, file.key, filePath);
  }

  // Process each image
  const files = fs.readdirSync(IMAGES_DIR);
  for (const file of files) {
    if (/\.(jpg|jpeg|png|gif)$/i.test(file)) {
      const filePath = path.join(IMAGES_DIR, file);
      await processImage(filePath);
    }
  }

  // Your logic to handle the processed videos, e.g., upload them to S3
};
