import dotenv from 'dotenv';
dotenv.config();
import swaggerUi from 'swagger-ui-express';
import YAML from 'js-yaml';
import fs from 'fs';


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

import getStoriesRouter from './routes/getStories.js';
import getPromptsRouter from './routes/getPrompts.js';
import getTwynesRouter from './routes/getTwynes.js';
import saveMomentRouter from './routes/saveMoment.js';
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
import getRenderStatus from './routes/getRenderStatus.js';
import getPrimers from './routes/getPrimers.js';
import createUser from './routes/createUser.js';
import deleteUser from './routes/deleteUser.js';
import updateUser from './routes/updateUser.js';
import getUser from './routes/getUser.js';

const app = express();

const swaggerDocument = YAML.load(fs.readFileSync('./api-spec/openapi.yaml', 'utf8')); // replace with the path to your swagger file
app.use(express.json());
const port = 3001;

app.use(cors());
app.use((req, res, next) => {
  req.db = db;
  next();
});
// Users
app.use('/v1/users', createUser);
app.use('/v1/users', deleteUser);
app.use('/v1/users', updateUser);
app.use('/v1/users', getUser);

// Stories
app.use('/v1/stories', getStoriesRouter);
app.use('/v1/createStory', createStory);
app.use('/v1', deleteStory);

app.use('/v1/getStorylines', getStorylines);

// Prompts
app.use('/v1/prompts', getPromptsRouter);
app.use('/v1/checkPromptLoading', checkPromptLoading);
app.use('/v1/getStoryPrompts', getStoryPrompts);

// Twynes
app.use('/v1/twynes', getTwynesRouter);
app.use('/v1', deleteTwyne);
app.use('/v1/confirmTwyne', confirmTwyne); 
app.use('/v1/saveMoment', saveMomentRouter);
app.use('/v1/checkMomentProcess', checkMomentProcess);
app.use(`/v1/collectPictures`, collectPictures);

// Utility
app.use('/v1/saveVideoUri', saveVideoUri);
app.use(`/v1/getThumbnails`, getThumbnails);
app.use(`/v1/getTitleDetails`, getTitleDetails);
app.use(`/v1/finalRender`, finalRender);
app.use(`/v1/confirmVideoRender`, confirmVideoRender);
app.use(`/v1/getRenderStatus`, getRenderStatus)
app.use(`/v1/getPrimers`, getPrimers);
app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Assistant
app.use('/v1/assistants/createThread', createThread);
app.use('/v1/assistants/userInput', userInput);

// Templates
app.use('/v1/getTemplate', getTemplateName);
app.use('/v1/buildStoryline', buildStoryline);






app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`);
});
