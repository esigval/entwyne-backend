const express = require('express');
const aws = require('aws-sdk');
const pool = require('../db/mySQL');
const dotenv = require('dotenv');
dotenv.config();

// Configure the AWS environment
aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();
const transcribeservice = new aws.TranscribeService();
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    // Step 1: Query database for files without transcripts
    const [filesToTranscribe] = await pool.query('SELECT * FROM media WHERE transcription IS NULL');

    if (filesToTranscribe.length === 0) {
      console.log('No files to transcribe.');
      return res.status(404).send('No files to transcribe.');
    }

    const fileToTranscribe = filesToTranscribe[0];
    const s3Key = fileToTranscribe.filename;

    // Step 2: Transcribe audio with AWS Transcribe
    console.log('Starting transcription process...');

    const transcribeParams = {
      TranscriptionJobName: 'TranscriptionJob-' + Date.now(), // Unique job name
      LanguageCode: 'en-US', // Assuming English language
      Media: {
        MediaFileUri: 's3://' + process.env.S3_BUCKET_NAME + '/' + s3Key
      },
      OutputBucketName: process.env.S3_BUCKET_NAME,
      // Other parameters like OutputKey, MediaFormat, etc., as needed
    };

    transcribeservice.startTranscriptionJob(transcribeParams, async function (err, data) {
      if (err) {
        console.error('Transcribe Error:', err);
        return res.status(500).send('Error starting transcription job.');
      }

      // Poll for the transcription job result or subscribe to some notification mechanism
      // This is a simplified version, consider implementing a robust polling mechanism
      let transcriptionJob = null;
      while (!transcriptionJob || transcriptionJob.TranscriptionJob.TranscriptionJobStatus !== 'COMPLETED') {
        // Wait for a bit before polling again
        await new Promise(resolve => setTimeout(resolve, 5000));
        console.log('Checking transcription job status...');

        const jobData = await transcribeservice.getTranscriptionJob({ TranscriptionJobName: transcribeParams.TranscriptionJobName }).promise();
        transcriptionJob = jobData;
        if (jobData.TranscriptionJob.TranscriptionJobStatus === 'FAILED') {
          throw new Error('Transcription job failed');
        }
      }

      // The URI of the transcription file in S3
      const transcriptionFileUri = transcriptionJob.TranscriptionJob.Transcript.TranscriptFileUri;

      // Parse the URI to get the bucket name and the file key
      const parsedUrl = new URL(transcriptionFileUri);

      // Parse the URI to get the bucket name and the file key
      const pathnameSegments = parsedUrl.pathname.split('/').filter(segment => segment);
      const bucketName = pathnameSegments[0];
      const fileKey = pathnameSegments.slice(1).join('/');

      console.log('File URL:', `https://${bucketName}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileKey}`);

      // Define the s3Params
      const s3Params = {
        Bucket: bucketName,
        Key: fileKey
      };

      // Fetch transcription result from S3
      const transcriptionObject = await s3.getObject(s3Params).promise();
      const transcriptionJson = JSON.parse(transcriptionObject.Body.toString('utf-8'));

      // Extract the full transcript
      const fullTranscript = transcriptionJson.results.transcripts[0].transcript;
      // Step 6: Update the database
      const updateQuery = `UPDATE media SET transcription = ?, transcriptionurl = ? WHERE id = ?`;
      await pool.query(updateQuery, [fullTranscript, transcriptionFileUri, fileToTranscribe.id]);

      // Return a successful response
      res.json({
        message: 'Transcription completed and saved to database',
        transcriptionContent: fullTranscript
      });
    });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('An error occurred while processing the media.');
  }
});

module.exports = router;
