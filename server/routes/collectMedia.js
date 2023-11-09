const express = require('express');
const https = require('https');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });
const multer = require('multer');
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const createConnection = require('../db/mySQL'); // Assuming this is the correct path to your database file

// AWS configuration
aws.config.update({
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
});

console.log(process.env.S3_BUCKET_NAME);

// Create S3 service object
const s3 = new aws.S3();

const router = express.Router();

function getNextFileName() {
  // S3 version of getNextFileName should handle file naming uniqueness
  const date = new Date();
  const timestamp = date.getTime();
  return `recorded-video-${timestamp}.webm`;
}

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: process.env.S3_BUCKET_NAME,
    // acl: 'public-read',
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      const newFileName = getNextFileName();
      cb(null, newFileName);
    },
  }),
});


router.post('/', upload.single('video'), async (req, res) => {
  const connection = createConnection();
  // Get the file location from multer-s3's req.file.location
  const videoPath = req.file.location; // S3 file URL
  const videoFilename = req.file.key; // The name of the file in the S3 bucket

  // Prepare SQL query to insert the file record
  const insertQuery = `INSERT INTO media (filename, filepath, transcription, sentiment, beattag) VALUES (?, ?, ?, ?, ?)`;

  connection.query(insertQuery, [videoFilename, videoPath, null, null, null], function(err, results) {
    if (err) {
      console.error('Error inserting video info into database:', err);
      res.status(500).send('Error recording video information in database.');
      connection.end(); // End the connection after handling the error
      return;
    }
    console.log(results);

    // Send response back to the client
    res.json({ message: 'Video uploaded to S3 and recorded in database successfully!', filename: videoFilename, path: videoPath });
    connection.end(); // End the connection after sending the response
  });
});

module.exports = router;
