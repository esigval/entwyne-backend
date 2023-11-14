// sends the media file to S3 bucket
// saves location to the database
// downloads the file from S3 bucket
// extracts audio from the file using ffmpeg
// saves the audio to the S3 bucket
// saves audio file location to the database

const express = require('express');
const https = require('https');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const fs = require('fs');
const ffmpeg = require('fluent-ffmpeg');


// AWS configuration
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

console.log(process.env.S3_BUCKET_NAME);

// Create S3 service object
const s3 = new aws.S3();
const pool = require('../db/mySQL');
const router = express.Router();

// Upload configuration for multer
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `recorded-video-${Date.now()}.webm`);
    },
  }),
});

router.post('/', upload.single('video'), async (req, res) => {
  const videoFilename = req.file.key;
  const videoPath = req.file.location;

  // Save video location to the database
  const insertVideoQuery = 'INSERT INTO media (filename, webmfilepath) VALUES (?, ?)';
  await pool.query(insertVideoQuery, [videoFilename, videoPath]);

  // Download the video file from S3
  const downloadParams = { Bucket: process.env.S3_BUCKET_NAME, Key: videoFilename };
  const videoData = await s3.getObject(downloadParams).promise();

  // Save video locally for processing
  const localVideoPath = path.join(__dirname, 'uploads', videoFilename);
  fs.writeFileSync(localVideoPath, videoData.Body);

  // Extract audio using ffmpeg
  const localAudioPath = localVideoPath.replace('.webm', '.mp3');
  await new Promise((resolve, reject) => {
    ffmpeg(localVideoPath)
      .output(localAudioPath)
      .noVideo()
      .audioCodec('libmp3lame')
      .on('end', resolve)
      .on('error', reject)
      .run();
  });

  // Upload extracted audio to S3
  const audioData = fs.readFileSync(localAudioPath);
  const audioFilename = path.basename(localAudioPath);
  const uploadParams = { Bucket: process.env.S3_BUCKET_NAME, Key: audioFilename, Body: audioData };
  const audioUploadData = await s3.upload(uploadParams).promise();

  // Save audio location to the database
  const updateAudioQuery = 'UPDATE media SET audio = ? WHERE filename = ?';
  await pool.query(updateAudioQuery, [audioUploadData.Location, videoFilename]);

  // Clean up: delete local files
  fs.unlinkSync(localVideoPath);
  fs.unlinkSync(localAudioPath);

  res.json({ message: 'Media processing complete' });
});

module.exports = router;
