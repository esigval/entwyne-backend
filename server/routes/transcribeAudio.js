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
    const [filesToTranscribe] = await pool.query('SELECT * FROM media WHERE transcription IS NULL');

    if (filesToTranscribe.length === 0) {
      console.log('No files to transcribe.');
      return res.status(404).send('No files to transcribe.');
    }

    let transcriptionPromises = filesToTranscribe.map(fileToTranscribe => {
      const s3Key = fileToTranscribe.filename;
      const transcribeParams = {
        TranscriptionJobName: 'TranscriptionJob-' + Date.now() + '-' + fileToTranscribe.id, // Unique job name
        LanguageCode: 'en-US', // Assuming English language
        Media: {
          MediaFileUri: 's3://' + process.env.S3_BUCKET_NAME + '/' + s3Key
        },
        OutputBucketName: process.env.S3_BUCKET_NAME,
      };
      return startTranscriptionJob(transcribeParams, fileToTranscribe.id);
    });

    await Promise.all(transcriptionPromises);

    res.json({ message: 'All transcription jobs started.' });
  } catch (error) {
    console.error('An error occurred:', error);
    res.status(500).send('An error occurred while processing the media.');
  }
});

async function startTranscriptionJob(transcribeParams, fileId) {
  try {
    await transcribeservice.startTranscriptionJob(transcribeParams).promise();
    console.log('Transcription job started for file ID:', fileId);
    let transcriptionJob;
    do {
      await new Promise(resolve => setTimeout(resolve, 5000)); // Wait for 5 seconds
      console.log('Checking transcription job status...');
      const jobData = await transcribeservice.getTranscriptionJob({ TranscriptionJobName: transcribeParams.TranscriptionJobName }).promise();
      transcriptionJob = jobData.TranscriptionJob;
      if (transcriptionJob.TranscriptionJobStatus === 'FAILED') {
        throw new Error('Transcription job failed');
      }
    } while (transcriptionJob.TranscriptionJobStatus !== 'COMPLETED');

    // Process the completed transcription job
    const transcriptionFileUri = transcriptionJob.Transcript.TranscriptFileUri;
    await processTranscriptionResult(transcriptionFileUri, fileId);
  } catch (error) {
    console.error('Error in starting transcription job for file ID', fileId, ':', error);
  }
}

async function processTranscriptionResult(transcriptionFileUri, fileId) {
  console.log('transcriptionFileUri:', transcriptionFileUri);
  const parsedUrl = new URL(transcriptionFileUri);
  const bucketName = process.env.S3_BUCKET_NAME;
  const pathSegments = parsedUrl.pathname.split('/');
  const fileKey = pathSegments[pathSegments.length - 1];
  console.log('fileKey:', fileKey);

  // Fetch transcription result from S3
  const s3Params = { Bucket: bucketName, Key: fileKey };
  const transcriptionObject = await s3.getObject(s3Params).promise();
  const transcriptionJson = JSON.parse(transcriptionObject.Body.toString('utf-8'));

  // Extract the full transcript
  const fullTranscript = transcriptionJson.results.transcripts[0].transcript;

  // Update the database
  const updateQuery = 'UPDATE media SET transcription = ?, transcriptionurl = ? WHERE id = ?';
  await pool.query(updateQuery, [fullTranscript, transcriptionFileUri, fileId]);
  console.log('Transcription updated in database for file ID', fileId);
}


module.exports = router;
