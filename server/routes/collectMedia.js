const express = require('express');
const router = express.Router();
const https = require('https');
const dotenv = require('dotenv');
const path = require('path');
const multer = require('multer');
const fs = require('fs');

const rawFootagePath = path.join(__dirname, '../assets/rawfootage');

function getNextFileName() {
    const files = fs.readdirSync(rawFootagePath);
    let maxIndex = -1;

    // Determine the highest existing iteration of 'recorded-video'
    files.forEach(file => {
        const match = file.match(/^recorded-video-(\d+)\.webm$/);
        if (match && +match[1] > maxIndex) {
            maxIndex = +match[1];
        }
    });

    // If 'recorded-video.webm' exists or other iterations exist, adjust the name
    if (files.includes('recorded-video.webm') || maxIndex !== -1) {
        return `recorded-video-${maxIndex + 1}.webm`;
    }

    // If 'recorded-video.webm' doesn't exist and no other iterations found, use default name
    return 'recorded-video.webm';
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, rawFootagePath);
  },
  filename: (req, file, cb) => {
    const newFileName = getNextFileName();
    cb(null, newFileName);
  }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('video'), (req, res) => {
  res.json({ message: 'Video uploaded successfully!' });
});

module.exports = router;
