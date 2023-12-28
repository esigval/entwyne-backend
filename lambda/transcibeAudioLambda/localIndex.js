import { TranscribeClient, StartTranscriptionJobCommand } from "@aws-sdk/client-transcribe";
import dotenv from 'dotenv';
dotenv.config();
// const { connect } from './db.js'; // Uncomment if you need MongoDB connection

// Initialize AWS Transcribe client
const transcribeClient = new TranscribeClient({ region: "us-east-1" });

const startTranscription = async () => {
    // Replace these with your actual S3 bucket name and file key
    const bucketName = 'twynes-post';
    const originalKey = 'audio/6573d2e66378fe2269485b44_20231226153219.mp3';
    const transcriptionJobName = `Transcription_${originalKey.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`;
    const audioFileUri = `s3://${bucketName}/${originalKey}`;

    console.log("Audio file URI:", audioFileUri);
    console.log("Preparing to start transcription job");

    try {
        const startTranscriptionJobParams = {
            TranscriptionJobName: transcriptionJobName,
            LanguageCode: 'en-US',
            Media: { MediaFileUri: audioFileUri },
            OutputBucketName: 'twynetranscription',
            OutputKey: `transcriptions/${transcriptionJobName}.json`
        };

        console.log("Transcription job parameters:", JSON.stringify(startTranscriptionJobParams));
        const response = await transcribeClient.send(new StartTranscriptionJobCommand(startTranscriptionJobParams));
        console.log("Transcription job started successfully, response:", JSON.stringify(response));

        // Uncomment and modify if MongoDB update is required
        // const db = await connect(); // Connect to MongoDB
        // const collection = db.collection('twynes'); // Replace with your collection name
        // const update = { $set: { transcriptionFileUri: transcriptionOutputUri } };
        // await collection.updateOne({ audioFileUri: audioFileUri }, update);
        // console.log("MongoDB record updated successfully");

    } catch (error) {
        console.error("Error starting transcription job:", error);
        console.error("Error details:", JSON.stringify(error, null, 2));
    }
};

startTranscription();
