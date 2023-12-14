const express = require('express');
const createPresignedUrl = require('./path-to-createPresignedUrl');

const app = express();

app.get('/generate-presigned-url', async (req, res) => {
  const videoName = req.query.videoName; // Assume video name is passed as a query parameter
  if (!videoName) {
    return res.status(400).send('Video name is required');
  }

  try {
    const presignedUrl = await createPresignedUrl('my-bucket', videoName);
    res.json({ presignedUrl });
  } catch (error) {
    console.error('Error generating pre-signed URL:', error);
    res.status(500).send('Internal Server Error');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
