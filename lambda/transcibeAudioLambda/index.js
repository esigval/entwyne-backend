import { TranscribeClient, StartTranscriptionJobCommand } from "@aws-sdk/client-transcribe";

// Initialize AWS Transcribe client
const transcribeClient = new TranscribeClient({ region: "us-east-1" });

export const handler = async (event) => {
    // const db = await connect(); // Connect to MongoDB

    for (const record of event.Records) {
        const bucketName = record.s3.bucket.name;
        const originalKey = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));
        const audioFileKey = originalKey.replace(/^audio\//, '');
        const transcriptionJobName = `Transcription_${audioFileKey.replace('.mp3', '')}`;
        const audioFileUri = `s3://${bucketName}/${originalKey}`;

        // Log the audio file URI
        console.log("Audio file URI:", audioFileUri);
        console.log("Preparing to start transcription job");

        try {
            const startTranscriptionJobParams = {
                TranscriptionJobName: transcriptionJobName,
                LanguageCode: 'en-US',
                Media: { MediaFileUri: audioFileUri },
                OutputBucketName: `twynetranscription`,
                OutputKey: `transcriptions/${transcriptionJobName}.json`
            };

            const command = new StartTranscriptionJobCommand(startTranscriptionJobParams);
            console.log("Transcription job parameters:", JSON.stringify(startTranscriptionJobParams));
            const response = await transcribeClient.send(command);
            console.log("Transcription job started successfully, response:", JSON.stringify(response));
            console.log("Transcription job started successfully");

        } catch (error) {
            console.error("Error starting transcription job:", error);
            // Optionally, log more details of the error
            console.error("Error details:", JSON.stringify(error, null, 2));
        }
    }
};