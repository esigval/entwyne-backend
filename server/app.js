import dotenv from 'dotenv';
dotenv.config();
import swaggerUi from 'swagger-ui-express';
import YAML from 'js-yaml';
import fs from 'fs';

import session from 'express-session';
import MongoStore from 'connect-mongo';
import express from 'express';
import cors from 'cors';
import { connect } from './db/db.js';
import { config } from './config.js';

// User management routes
import createUser from './routes/createUser.js';
import deleteUser from './routes/deleteUser.js';
import updateUser from './routes/updateUser.js';
import getUser from './routes/getUser.js';
import userLogin from './routes/userLogin.js';
import userToken from './routes/userToken.js';
import handleRefreshToken from './routes/handleRefreshToken.js';

// Story-related routes
import getStoriesRouter from './routes/getStories.js';
import getStory from './routes/getStory.js';
import createStory from './routes/createStory.js';
import deleteStory from './routes/deleteStory.js';
import getStorylines from './routes/getStorylines.js';

// Prompt-related routes
import createPrompt from './routes/createPrompt.js';
import getPrompt from './routes/getPrompt.js';
import getAllPrompts from './routes/getAllPrompts.js';
import deletePrompt from './routes/deletePrompt.js';
import updatePrompt from './routes/updatePrompt.js';
import checkPromptLoading from './routes/checkPromptLoading.js';
import getStoryPrompts from './routes/getStoryPrompts.js';
import getStorylinePrompts from './routes/getStorylinePrompts.js';

// Moment (story segments) routes
import getAllMoments from './routes/getMoments.js';
import deleteMoment from './routes/deleteMoment.js';
import confirmMoment from './routes/confirmMoment.js';
import saveMomentRouter from './routes/saveMoment.js';
import checkMomentProcess from './routes/checkMomentProcess.js';
import collectPictures from './routes/collectPictures.js';

// Utility routes for media processing and additional functionalities
import saveVideoUri from './routes/saveVideoUri.js';
import getThumbnails from './routes/getThumbnails.js';
import getTitleDetails from './routes/sendTitleDetails.js'; // Note: The import path may need correction to match the file name
import finalRender from './routes/getFinalRender.js';
import confirmVideoRender from './routes/confirmVideoRender.js';
import getRenderStatus from './routes/getRenderStatus.js';
import getPrimers from './routes/getPrimers.js';

// Routes for handling assistant interactions
import createThread from './routes/createThread.js';
import userInput from './routes/userInput.js';

// Routes for template management and story building
import getTemplateName from './routes/getTemplateName.js';
import buildStoryline from './routes/buildStoryline.js';

// Documentation
import instructions from './routes/instructions.js';

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

let db;

async function startDatabase() {
    try {
        db = await connect();
    } catch (err) {
        console.error('Failed to connect to the database:', err);
    }
}

startDatabase();

const app = express();

const swaggerDocument = YAML.load(fs.readFileSync('./api-spec/openapi.yaml', 'utf8')); // replace with the path to your swagger file
app.use(express.json());
const port = 3001;

// Set up MongoDB connection for sessions
/*const sessionStore = MongoStore.create({
  mongoUrl: currentConfig.MONGODB_URI, // Use your MongoDB connection string
  collectionName: 'sessions'
});*/

// Session middleware configuration
/*app.use(session({
  secret: currentConfig.SESSION_TRACKING_SECRET,
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    secure: process.env.NODE_ENV === "production",
    maxAge: 1000 * 60 * 60 * 24
  }
}));*/

app.use(cors());
app.use((req, res, next) => {
  req.db = db;
  next();
});

// API routes

// Users (protected)
app.use('/v1/users', createUser); // Not protected
app.use('/v1/users', deleteUser);
app.use('/v1/users', updateUser);
app.use('/v1/login', userLogin);
app.use('/v1/refreshToken', handleRefreshToken);

// TBD - when do we need to get a userId?
app.use('/v1/users', getUser);

// Stories (protected)
app.use('/v1/stories', getStoriesRouter);
app.use('/v1/createStory', createStory);
app.use('/v1', deleteStory);
app.use('/v1/stories', getStory);
app.use('/v1/getStorylines', getStorylines);

// Prompts (protected)
app.use('/v1/prompts', createPrompt);
app.use('/v1/prompts', getPrompt);
app.use('/v1/getAllPrompts', getAllPrompts);
app.use('/v1/prompts', deletePrompt);
app.use('/v1/prompts', updatePrompt);
app.use('/v1/getStorylinePrompts', getStorylinePrompts);

// Prompts internal
app.use('/v1/checkPromptLoading', checkPromptLoading);
app.use('/v1/getStoryPrompts', getStoryPrompts);

// Moments
app.use('/v1/getAllMoments', getAllMoments); // protected
app.use('/v1/moments', deleteMoment); // protected
app.use('/v1/moments', createMoment); 
app.use('/v1/confirmMoment', confirmMoment); 
app.use('/v1/uploadSaveMoment', saveMomentRouter);
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

// Assistant Interaction
app.use('/v1/assistants/createThread', createThread);
app.use('/v1/assistants/userInput', userInput);

// Templates
app.use('/v1/getTemplate', getTemplateName);
app.use('/v1/buildStoryline', buildStoryline);

// Documentation
app.use('/v1/instructions', instructions);


app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`);
});
