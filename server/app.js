import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import { connect } from './db/db.js';

let db;

async function startDatabase() {
    try {
        db = await connect();
    } catch (err) {
        console.error('Failed to connect to the database:', err);
    }
}

startDatabase();

// import stitchVideosRouter from './routes/stitchVideos';
// import gptRequestRouter from './routes/gptRequest';
// import collectMediaRouter from './routes/collectMedia';
// import transcribeAudioRouter from './routes/transcribeAudio';
// import recursiveStorylineGeneratorRouter from './routes/recursiveStorylineGenerator';
import getStoriesRouter from './routes/getStories.js';
import getPromptsRouter from './routes/getPrompts.js';
import getTwynesRouter from './routes/getTwynes.js';
import getS3PresignedUrlRouter from './routes/getS3PresignedUrl.js';
import saveVideoUri from './routes/saveVideoUri.js';
import createThread from './routes/assistants/createThread.js';
import createStory from './routes/createStory.js';
import deleteStory from '/routes/deleteStory.js';
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
app.use((req, res, next) => {
  req.db = db;
  next();
});
app.use('/v1/stories', getStoriesRouter);
app.use('/v1/prompts', getPromptsRouter);
app.use('/v1/twynes', getTwynesRouter);
app.use('/v1/getS3PresignedUrl', getS3PresignedUrlRouter);
app.use('/v1/saveVideoUri', saveVideoUri);
app.use('/v1/assistants/createThread', createThread);
app.use('/v1/createStory', createStory);
app.use('/v1/deleteStory/:id', deleteStory);
// app.use('/collectCharacters', collectCharactersRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});