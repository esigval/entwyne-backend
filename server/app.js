require('dotenv').config();

const express = require('express');
const cors = require('cors');

const stitchVideosRouter = require('./routes/stitchVideos');
const gptRequestRouter = require('./routes/gptRequest');
const collectMediaRouter = require('./routes/collectMedia');
const transcribeAudioRouter = require('./routes/transcribeAudio');
const recursiveStorylineGeneratorRouter = require('./routes/recursiveStorylineGenerator');
// const collectCharactersRouter = require('./routes/collectCharacters');

const app = express();
app.use(express.json());
const port = 3001;

app.use(cors());
app.use('/gpt', gptRequestRouter);
app.use('/stitchVideos', stitchVideosRouter);
app.use('/collectMedia', collectMediaRouter);
app.use('/transcribeAudio', transcribeAudioRouter);
app.use('/recursiveStorylineGenerator', recursiveStorylineGeneratorRouter);
// app.use('/collectCharacters', collectCharactersRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});