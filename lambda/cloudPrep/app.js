const AWS = require('aws-sdk');
const fs = require('fs').promises;
const path = require('path');
const { extractAudio, extractThumbnail, getVideoDetails, compressVideo, createSilentAudioTrack, checkBinary } = require('./videoUtils.js');
const path = require('path');
const __dirname = path.dirname(__filename);
const s3 = new AWS.S3();

// Set the path to the FFmpeg binary included in your deployment package
const ffmpegPath = join(__dirname, 'bin', 'ffmpeg');
const ffprobePath = join(__dirname, 'bin', 'ffprobe');

const handler = async (event) => {
    console.log("Handler started");
    console.log("Checking FFmpeg and FFprobe binaries");
    const ffmpegWorking = await checkBinary(ffmpegPath, 'FFmpeg');  
    const ffprobeWorking = await checkBinary(ffprobePath, 'FFprobe');
    if (!ffmpegWorking || !ffprobeWorking) {
        throw new Error('FFmpeg or FFprobe binaries are not working');
    }
    console.log("FFmpeg and FFprobe binaries are working");
    
    const bucketName = event.Records[0].s3.bucket.name;
    const objectKey = event.Records[0].s3.object.key;
    console.log(`Processing file from bucket: ${bucketName}, key: ${objectKey}`);
    const inputFilePath = path.join('/tmp', path.basename(objectKey));
    const outputDir = '/tmp';

    const outputAudio = path.join(outputDir, 'output_audio.mp3');
    const outputThumbnail = path.join(outputDir, 'output_thumbnail.png');
    const outputProxy = path.join(outputDir, 'output_proxy.mp4');

    const getOutputKey = (type) => {
        const parts = objectKey.split('/');
        parts[parts.length - 2] = type;
        return parts.join('/');
    };

    try {
        console.log("Downloading file from S3");
        const params = {
            Bucket: bucketName,
            Key: objectKey,
        };
        const data = await s3.getObject(params).promise();
        await fs.writeFile(inputFilePath, data.Body);
        console.log("File downloaded and saved locally");

        console.log("Checking for silent audio track creation");
        const silentAudioCreated = await createSilentAudioTrack(inputFilePath, outputAudio);

        let audioPromise;
        if (!silentAudioCreated) {
            console.log("Silent audio track not created, extracting audio");
            audioPromise = extractAudio(inputFilePath, outputAudio);
        } else {
            console.log("Silent audio track created, skipping audio extraction");
            audioPromise = Promise.resolve();
        }

        console.log("Extracting thumbnail");
        const thumbnailPromise = extractThumbnail(inputFilePath, outputThumbnail);

        console.log("Getting video details for compression");
        const { width, height } = await getVideoDetails(inputFilePath);
        const orientation = width > height ? 'horizontal' : 'vertical';
        console.log(`Video orientation: ${orientation}`);
        const compressPromise = compressVideo(inputFilePath, outputProxy, 'Proxy', orientation);

        await Promise.all([audioPromise, thumbnailPromise, compressPromise]);
        console.log("Audio, thumbnail, and proxy video processed");

        console.log("Uploading outputs back to S3");
        const uploadToS3 = async (filePath, type) => {
            console.log(`Uploading ${type}`);
            const outputData = await fs.readFile(filePath);
            const outputParams = {
                Bucket: bucketName,
                Key: getOutputKey(type),
                Body: outputData,
            };
            await s3.putObject(outputParams).promise();
            console.log(`${type} uploaded`);
        };

        await Promise.all([
            uploadToS3(outputAudio, 'audiopcm'),
            uploadToS3(outputThumbnail, 'thumbnail'),
            uploadToS3(outputProxy, 'proxy'),
        ]);

        console.log("All outputs uploaded to S3");
        return { status: 'Success' };
    } catch (error) {
        console.error(error);
        throw new Error(`Error processing file from S3: ${error.message}`);
    }
};

module.exports = { handler };