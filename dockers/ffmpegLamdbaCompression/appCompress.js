const AWS = require('aws-sdk');
const fs = require('fs').promises;
const path = require('path');
const { getVideoDetails, compressVideo, checkBinary } = require('./videoUtils.js');

const s3 = new AWS.S3();

const handler = async (event) => {
    console.log("Compress handler started");
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
    const outputProxy = path.join(outputDir, 'output_proxy.mp4');

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

        console.log("Getting video details for compression");
        const { width, height } = await getVideoDetails(inputFilePath);
        const orientation = width > height ? 'horizontal' : 'vertical';
        console.log(`Video orientation: ${orientation}`);
        await compressVideo(inputFilePath, outputProxy, 'Proxy', orientation);

        const outputProxyKey = getOutputKey('proxy');

        if (!process.env.VIDEO_INPUT_PATH) {
            console.log("Uploading proxy output back to S3");
            const outputData = await fs.readFile(outputProxy);
            const outputParams = {
                Bucket: outputBucketName,
                Key: outputProxyKey,
                Body: outputData,
            };
            await s3.putObject(outputParams).promise();
            console.log("Proxy uploaded");
        } else {
            console.log("Local testing, skipping upload to S3");
        }

        return { status: 'Success' };
    } catch (error) {
        console.error(error);
        throw new Error(`Error processing video file from S3: ${error.message}`);
    }
};

module.exports = { handler };
