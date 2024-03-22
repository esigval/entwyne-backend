import dotenv from 'dotenv';
dotenv.config();
import swaggerUi from 'swagger-ui-express';
import YAML from 'js-yaml';
import fs, { appendFile } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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
import handleRefreshToken from './routes/handleRefreshToken.js';
import userLogout from './routes/userLogout.js';
import changePassword from './routes/changePassword.js'; 
import addCoCreator from './routes/addCoCreator.js';
import getSharedStories from './routes/getSharedStories.js';
import userChangeEmail from './routes/userChangeEmail.js';
import UserConfirmEmail from './routes/userConfirmEmail.js';
import userResetPassword from './routes/userResetPassword.js';
import userConfirmPassword from './routes/userConfirmPassword.js';
import userAddToTwyne from './routes/userAddToTwyne.js';


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
import assignContributors from './routes/assignContributors.js'; 

// Moment (story segments) routes
import getAllMoments from './routes/getMoments.js';
import deleteMoment from './routes/deleteMoment.js';
import confirmMoment from './routes/confirmMoment.js';
import saveMomentRouter from './routes/saveMoment.js';
import checkMomentProcess from './routes/checkMomentProcess.js';
import collectPictures from './routes/collectPictures.js';
import uploadMoment from './routes/uploadMoment.js';

// Utility routes for media processing and additional functionalities
import saveVideoUri from './routes/saveVideoUri.js';
import getThumbnails from './routes/getThumbnails.js';
import getTitleDetails from './routes/sendTitleDetails.js'; // Note: The import path may need correction to match the file name
import finalRender from './routes/getFinalRender.js';
import confirmVideoRender from './routes/confirmVideoRender.js';
import getRenderStatus from './routes/getRenderStatus.js';
import getPrimers from './routes/getPrimers.js';

// Twyne routes
import twyneRoutes from './routes/modifyTwynes.js';
import twyneByStory from './routes/getTwynesByStory.js';

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
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'public'));


const swaggerDocument = YAML.load(fs.readFileSync('./api-spec/openapi.yaml', 'utf8')); // replace with the path to your swagger file
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.get('/v1/reset-password', (req, res) => {
  res.render('password-reset', { apiUrl: currentConfig.EMAIL_RESET_BASE_URL_NO_ROUTE });
});

app.get('/v1/new-password', (req, res) => {
  res.render('new-password', { apiUrl: currentConfig.EMAIL_RESET_BASE_URL_NO_ROUTE });
});
const port = 3001;

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
app.use('/v1/logout', userLogout); // protected
app.use('/v1/changePassword', changePassword); // protected
app.use('/v1/addCoCreator', addCoCreator); // protected
app.use('/v1/changeEmail', userChangeEmail); // protected
app.use('/v1/confirmEmail', UserConfirmEmail); // Not protected
app.use('/v1/resetPassword', userResetPassword); // Not protected
app.use('/v1/confirmPassword', userConfirmPassword); // Not protected




// TBD - when do we need to get a userId?
app.use('/v1/users', getUser);

// Stories (protected)
app.use('/v1/stories', getStoriesRouter);
app.use('/v1/createStory', createStory);
app.use('/v1', deleteStory);
app.use('/v1/stories', getStory);
app.use('/v1/getStorylines', getStorylines);
app.use('/v1/sharedStories', getSharedStories); // protected

// Prompts (protected)
app.use('/v1/prompts', createPrompt);
app.use('/v1/prompts', getPrompt);
app.use('/v1/getAllPrompts', getAllPrompts);
app.use('/v1/prompts', deletePrompt);
app.use('/v1/prompts', updatePrompt);
app.use('/v1/getStorylinePrompts', getStorylinePrompts);
app.use('/v1/assignContributors', assignContributors); // protected

// Prompts internal
app.use('/v1/checkPromptLoading', checkPromptLoading);
app.use('/v1/getStoryPrompts', getStoryPrompts);

// Moments (protected)
app.use('/v1/getAllMoments', getAllMoments); // protected
app.use('/v1/moments', deleteMoment); // protected
app.use('/v1/confirmMoment', confirmMoment); // protected
app.use('/v1/uploadSaveMoment', saveMomentRouter); // protected
app.use('/v1/checkMomentProcess', checkMomentProcess); // protected
app.use(`/v1/collectPictures`, collectPictures); // protected
app.use('/v1/moments/preSigned', uploadMoment); // protected

// Twynes (protected)
app.use('/v1/twyne', twyneRoutes); // protected
app.use('/v1/twyne/story', twyneByStory);
app.use('/v1/twyne/addUser', userAddToTwyne); // protected

// Utility (protected)
app.use('/v1/saveVideoUri', saveVideoUri); // protected
app.use(`/v1/getThumbnails`, getThumbnails); // protected
app.use(`/v1/getTitleDetails`, getTitleDetails); // protected
app.use(`/v1/finalRender`, finalRender); // protected
app.use(`/v1/confirmVideoRender`, confirmVideoRender); // protected
app.use(`/v1/getRenderStatus`, getRenderStatus); // protected
app.use(`/v1/getPrimers`, getPrimers); // protected
app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Assistant Interaction (protected)
app.use('/v1/assistants/createThread', createThread); // protected
app.use('/v1/assistants/userInput', userInput); // protected

// Templates (protected)
app.use('/v1/getTemplate', getTemplateName); // protected
app.use('/v1/buildStoryline', buildStoryline); // protected

// Documentation
app.use('/v1/instructions', instructions);


app.listen(port, '0.0.0.0', () => {
  console.log(`Example app listening on port ${port}`);
});
