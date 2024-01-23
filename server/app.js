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
import createThread from './routes/createThread.js';
import createStory from './routes/createStory.js';
import deleteStory from './routes/deleteStory.js';
import deleteTwyne from './routes/deleteTwyne.js';
import userInput from './routes/userInput.js';
import getTemplateName from './routes/getTemplateName.js'
import buildStoryline from './routes/buildStoryline.js'
import checkMomentProcess from './routes/checkMomentProcess.js';
import confirmTwyne from './routes/confirmTwyne.js';
import collectPictures from './routes/collectPictures.js';
import getThumbnails from './routes/getThumbnails.js'; 
import checkPromptLoading from './routes/checkPromptLoading.js';  
import getStoryPrompts from './routes/getStoryPrompts.js';
import getTitleDetails from './routes/sendTitleDetails.js';
import finalRender from './routes/getFinalRender.js';
import confirmVideoRender from './routes/confirmVideoRender.js';
import getStorylines from './routes/getStorylines.js';
// import modelResponse from './routes/assistants/modelResponse.js';
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
app.use('/v1', deleteStory);
app.use('/v1', deleteTwyne);
app.use('/v1/assistants/userInput', userInput);
app.use('/v1/getTemplate', getTemplateName);
app.use('/v1/buildStoryline', buildStoryline);
app.use('/v1/checkMomentProcess', checkMomentProcess);
app.use('/v1/confirmTwyne', confirmTwyne); 
app.use(`/v1/collectPictures`, collectPictures);
app.use(`/v1/getThumbnails`, getThumbnails);
app.use(`/v1/checkPromptLoading`, checkPromptLoading);
app.use(`/v1/getStoryPrompts`, getStoryPrompts);
app.use(`/v1/getTitleDetails`, getTitleDetails);
app.use(`/v1/finalRender`, finalRender);
app.use(`/v1/confirmVideoRender`, confirmVideoRender);
app.use(`/v1/getStorylines`, getStorylines);
// app.use('/v1/assistants/modelResponse', modelResponse);
// app.use('/collectCharacters', collectCharactersRouter);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});