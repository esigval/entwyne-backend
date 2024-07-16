const AWS = require('aws-sdk');
const fs = require('fs').promises;
const path = require('path');
const { extractAudio, createSilentAudioTrack, checkBinary } = require('./videoUtils.js');

const s3 = new AWS.S3();

const handler = async (event) => {
    console.log("Audio handler started");
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
    const outputAudio = path.join(outputDir, 'output_audio.wav');

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

        console.log("Checking for silent audio track creation");
        const silentAudioCreated = await createSilentAudioTrack(inputFilePath, outputAudio);

        if (!silentAudioCreated) {
            console.log("Silent audio track not created, extracting audio");
            await extractAudio(inputFilePath, outputAudio);
        } else {
            console.log("Silent audio track created, skipping audio extraction");
        }

        const outputAudioKey = getOutputKey('audiopcm');

        if (!process.env.VIDEO_INPUT_PATH) {
            console.log("Uploading audio output back to S3");
            const outputData = await fs.readFile(outputAudio);
            const outputParams = {
                Bucket: outputBucketName,
                Key: outputAudioKey,
                Body: outputData,
            };
            await s3.putObject(outputParams).promise();
            console.log("Audio uploaded");
        } else {
            console.log("Local testing, skipping upload to S3");
        }

        return { status: 'Success' };
    } catch (error) {
        console.error(error);
        throw new Error(`Error processing audio file from S3: ${error.message}`);
    }
};

module.exports = { handler };
