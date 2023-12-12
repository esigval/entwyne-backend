import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';


// import stitchVideosRouter from './routes/stitchVideos';
// import gptRequestRouter from './routes/gptRequest';
// import collectMediaRouter from './routes/collectMedia';
// import transcribeAudioRouter from './routes/transcribeAudio';
// import recursiveStorylineGeneratorRouter from './routes/recursiveStorylineGenerator';
import getStoriesRouter from './routes/getStories.js';
import getPromptsRouter from './routes/getPrompts.js';
// const collectCharactersRouter = require('./routes/collectCharacters');

const app = express();
app.use(express.json());
const port = 3001;

app.use(cors());
// app.use('/gpt', gptRequestRouter);
// app.use('/stitchVideos', stitchVideosRouter);
// app.use('/collectMedia', collectMediaRouter);
// app.use('/transcribeAudio', transcribeAudioRouter);
// app.use('/recursiveStorylineGenerator', recursiveStorylineGeneratorRouter);
app.use('/v1/stories', getStoriesRouter);
app.use('/v1/prompts', getPromptsRouter);
// app.use('/collectCharacters', collectCharactersRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});