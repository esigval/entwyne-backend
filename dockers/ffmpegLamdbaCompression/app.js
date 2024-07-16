const AWS = require('aws-sdk');
const fs = require('fs').promises;
const path = require('path');

const { extractAudio, extractThumbnail, getVideoDetails, compressVideo, createSilentAudioTrack, checkBinary } = require('./videoUtils.js');

const s3 = new AWS.S3();
/*
const mockEvent = {
    Records: [
        {
            s3: {
                bucket: {
                    name: 'mock-bucket'
                },
                object: {
                    key: '668c638142e8c284646d10c9/video/668f4bfb47058b16e88ae046'
                }
            }
        }
    ]
};*/

// Cleanup function to delete files in the /tmp directory
const cleanupTmpDirectory = async () => {
    try {
        const files = await fs.readdir('/tmp');
        for (const file of files) {
            await fs.unlink(path.join('/tmp', file));
        }
        console.log("Temporary files cleaned up");
    } catch (error) {
        console.error("Error cleaning up temporary files:", error);
    }
};

const handler = async (event) => {
    await cleanupTmpDirectory();
    
    console.log("Handler started");
    console.log("Checking FFmpeg and FFprobe binaries");
    const ffmpegWorking = await checkBinary('/usr/bin/ffmpeg', 'FFmpeg');  
    const ffprobeWorking = await checkBinary('/usr/bin/ffprobe', 'FFprobe');
    if (!ffmpegWorking || !ffprobeWorking) {
        throw new Error('FFmpeg or FFprobe binaries are not working');
    }
    console.log("FFmpeg and FFprobe binaries are working");

    const inputBucketName = event.Records[0].s3.bucket.name;
    const outputBucketName = process.env.OUTPUT_BUCKET_NAME;
    console.log(`Input bucket: ${inputBucketName}, Output bucket: ${outputBucketName}`);
    const objectKey = event.Records[0].s3.object.key;
    console.log(`Processing file from bucket: ${inputBucketName}, key: ${objectKey}`);
    
    // Use the local test video file path for testing
    const inputFilePath = process.env.VIDEO_INPUT_PATH || path.join('/tmp', path.basename(objectKey));
    const outputDir = '/tmp';

    const outputAudio = path.join(outputDir, 'output_audio.wav');
    const outputThumbnail = path.join(outputDir, 'output_thumbnail.png');
    const outputProxy = path.join(outputDir, 'output_proxy.mp4');

    const getOutputKey = (type) => {
        const parts = objectKey.split('/');
        parts[parts.length - 2] = type;
        return parts.join('/');
    };

    const getContentType = (type) => {
        switch (type) {
            case 'audiopcm': return 'audio/wav';
            case 'thumbnail': return 'image/png';
            case 'proxy': return 'video/mp4';
            default: return 'application/octet-stream';
        }
    };

    try {
        // Skip the S3 download step for local testing
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

        const outputAudioKey = getOutputKey('audiopcm');
        const outputThumbnailKey = getOutputKey('thumbnail');
        const outputProxyKey = getOutputKey('proxy');

        console.log(`Output Audio Key: ${outputAudioKey}`);
        console.log(`Output Thumbnail Key: ${outputThumbnailKey}`);
        console.log(`Output Proxy Key: ${outputProxyKey}`);

        if (!process.env.VIDEO_INPUT_PATH) {
            console.log("Uploading outputs back to S3");
            const uploadToS3 = async (filePath, type) => {
                console.log(`Uploading ${type}`);
                const outputData = await fs.readFile(filePath);
                const outputParams = {
                    Bucket: outputBucketName,
                    Key: getOutputKey(type),
                    Body: outputData,
                    ContentType: getContentType(type),
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
        } else {
            console.log("Local testing, skipping upload to S3");
        }

        return { status: 'Success' };
    } catch (error) {
        console.error(error);
        throw new Error(`Error processing file from S3: ${error.message}`);
    }
};

module.exports = { handler };

// Uncomment this section for local testing
/*
(async () => {
    try {
        await handler(mockEvent);
        console.log("Handler executed successfully");
    } catch (error) {
        console.error("Error executing handler:", error);
    }
})(); */
