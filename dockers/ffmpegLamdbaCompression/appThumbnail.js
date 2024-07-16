const AWS = require('aws-sdk');
const fs = require('fs').promises;
const path = require('path');
const { extractThumbnail, checkBinary } = require('./videoUtils.js');

const s3 = new AWS.S3();

const handler = async (event) => {
    console.log("Thumbnail handler started");
    console.log("Checking FFmpeg and FFprobe binaries");
    const ffmpegWorking = await checkBinary('/usr/bin/ffmpeg', 'FFmpeg');  
    const ffprobeWorking = await checkBinary('/usr/bin/ffprobe', 'FFprobe');
    if (!ffmpegWorking || !ffprobeWorking) {
        throw new Error('FFmpeg or FFprobe binaries are not working');
    }
    console.log("FFmpeg and FFprobe binaries are working");

    const inputBucketName = event.Records[0].s3.bucket.name;
    const outputBucketName = process.env.OUTPUT_BUCKET_NAME;
    const objectKey = event.Records[0].s3.object.key;

    const inputFilePath = process.env.VIDEO_INPUT_PATH || path.join('/tmp', path.basename(objectKey));
    const outputDir = '/tmp';
    const outputThumbnail = path.join(outputDir, 'output_thumbnail.png');

    const getOutputKey = (type) => {
        const parts = objectKey.split('/');
        parts[parts.length - 2] = type;
        return parts.join('/');
    };

    try {
        if (!process.env.VIDEO_INPUT_PATH) {
            console.log("Downloading file from S3");
            const params = {
                Bucket: inputBucketName,
                Key: objectKey,
            };
            const data = await s3.getObject(params).promise();
            await fs.writeFile(inputFilePath, data.Body);
            console.log("File downloaded and saved locally");
        }

        console.log("Extracting thumbnail");
        await extractThumbnail(inputFilePath, outputThumbnail);

        const outputThumbnailKey = getOutputKey('thumbnail');

        if (!process.env.VIDEO_INPUT_PATH) {
            console.log("Uploading thumbnail output back to S3");
            const outputData = await fs.readFile(outputThumbnail);
            const outputParams = {
                Bucket: outputBucketName,
                Key: outputThumbnailKey,
                Body: outputData,
            };
            await s3.putObject(outputParams).promise();
            console.log("Thumbnail uploaded");
        } else {
            console.log("Local testing, skipping upload to S3");
        }

        return { status: 'Success' };
    } catch (error) {
        console.error(error);
        throw new Error(`Error processing thumbnail file from S3: ${error.message}`);
    }
};

module.exports = { handler };
