import { TranscribeStreamingClient, StartStreamTranscriptionCommand, AudioStream } from "@aws-sdk/client-transcribe-streaming";
import dotenv from 'dotenv';
import { S3 } from '@aws-sdk/client-s3';
dotenv.config();
// import { connect } from './db.js'; // Uncomment if you need MongoDB connection
import { Readable } from 'stream';
import toArray from 'stream-to-array';

// Initialize AWS S3 client
const s3 = new S3();

// Initialize AWS Transcribe Streaming client
const transcribeStreamingClient = new TranscribeStreamingClient({ region: "us-east-1" });

const startTranscription = async () => {
    const bucketName = 'twynes-post';
    const originalKey = 'audio/audio.flac';
    const audioFileUri = `https://${bucketName}.s3.amazonaws.com/${originalKey}`;

    console.log("Audio file URI:", audioFileUri);
    console.log("Preparing to start transcription job");

    try {
        const audioFile = await s3.getObject({ Bucket: bucketName, Key: originalKey });
        const audioArray = await toArray(audioFile.Body);
        const audioBuffer = Buffer.concat(audioArray);

        // Assuming audio file is PCM with a known sample rate
        const sampleRate = 16000; // Set your audio's sample rate here
        const chunkDurationMs = 50; // Duration of each audio chunk
        const chunkSizeBytes = Math.floor(chunkDurationMs / 1000 * sampleRate * 2); // 2 bytes per sample for 16-bit audio

        // Async generator function to yield audio chunks
        async function* generateAudioChunks(buffer, chunkSize) {
            let offset = 0;
            while (offset < buffer.length) {
                yield buffer.slice(offset, offset + chunkSize);
                offset += chunkSize;
            }
        }

        const startStreamTranscriptionCommandParams = {
            LanguageCode: 'en-US',
            MediaSampleRateHertz: 16000,
            MediaEncoding: 'pcm',
            AudioStream: generateAudioChunks(audioBuffer, chunkSizeBytes)
        };

        console.log("Starting transcription job");
        const response = await transcribeStreamingClient.send(new StartStreamTranscriptionCommand(startStreamTranscriptionCommandParams));

        for await (const event of response.TranscriptResultStream) {
            if (event.TranscriptEvent) {
                const results = event.TranscriptEvent.Transcript.Results;
                if (results.length > 0 && !results[0].IsPartial) {
                    console.log(`Transcript: ${results[0].Alternatives[0].Transcript}`);
                }
            }
        }
        console.log("Transcription job completed successfully");

        // console.log("Transcription job started successfully, response:", JSON.stringify(response));

        /* Uncomment and modify if MongoDB update is required
        const db = await connect(); // Connect to MongoDB
        const collection = db.collection('twynes'); // Replace with your collection name
        const update = { $set: { transcriptionFileUri: transcriptionOutputUri } };
        await collection.updateOne({ audioFileUri: audioFileUri }, update);
        console.log("MongoDB record updated successfully");*/
    } catch (error) {
        console.error("Error starting transcription job:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
    }
};

startTranscription();