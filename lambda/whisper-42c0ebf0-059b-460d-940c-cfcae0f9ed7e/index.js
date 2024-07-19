import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";
import { OpenAI } from 'openai';
import fs, { promises as fsPromises } from 'fs';
import wavefile from 'wavefile';
import axios from 'axios'; // Import axios

const s3 = new S3Client({ region: process.env.AWS_REGION });
const openai = new OpenAI(process.env.OPENAI_API_KEY);

async function handler(event) {
    console.log('starting transcription call')
    for (const record of event.Records) {
        const bucketName = record.s3.bucket.name;
        const objectKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
        // Extract the userId and momentId from the objectKey
        const parts = objectKey.split('/');
        const userId = parts.slice(0, parts.indexOf('audiopcm')).join('/');
        const momentId = parts.slice(parts.indexOf('audiopcm') + 1).join('/');

        if (objectKey.includes('audiopcm')) {
            const tmpFilePath = `/tmp/${objectKey.split('/').pop()}.wav`;

            try {
                const file = await s3.send(new GetObjectCommand({
                    Bucket: bucketName,
                    Key: objectKey
                }));

                await fsPromises.writeFile(tmpFilePath, file.Body);

                try {
                    const buffer = fs.readFileSync(tmpFilePath);
                    const wav = new wavefile.WaveFile(buffer);
                    if (!wav.container || !wav.format || wav.toBuffer().length === 0) {
                        throw new Error('Invalid WAV file');
                    }
                } catch (error) {
                    console.error('Invalid WAV file:', error);
                    return;
                }

                const fileStream = fs.createReadStream(tmpFilePath);

                try {
                    console.log('Starting transcription...');
                    const transcription = await openai.audio.transcriptions.create({
                        file: fileStream,
                        model: "whisper-1",
                        response_format: "verbose_json",
                        timestamp_granularities: ["word"]
                    });

                    // Prepare the data for the API request
                    const data = {
                        transcription: transcription.text,
                        stampedTranscription: transcription.words
                    };

                    console.log('Transcription:', data);

                    // Send a PATCH request to the API
                    const response = await axios.patch(`${process.env.API_BASE_URL}/${userId}/${momentId}`, data);

                    console.log('API response:', response.data);

                } catch (error) {
                    console.error('Error during transcription:', error);
                }

                await fsPromises.unlink(tmpFilePath); // Cleanup the temporary file

            } catch (error) {
                console.error("Error processing file:", objectKey, error);
                try {
                    await fsPromises.unlink(tmpFilePath);
                } catch (cleanupError) {
                    console.error("Cleanup Error:", cleanupError);
                }
            }
        } else {
            console.log("Object key does not match pattern:", objectKey);
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'Execution completed' })
    };
};

export { handler };