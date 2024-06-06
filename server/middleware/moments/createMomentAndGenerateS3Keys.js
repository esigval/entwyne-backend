import Moment from '../../models/momentModel.js';
import Prompt from '../../models/promptModel.js';
import assignMomentToClip from './assignMomentToClip.js';

const createMomentAndGenerateS3Keys = async (req, res, next) => {
  const userId = req.userId;
  const { promptId } = req.params; 
  const mimeType = req.query.mimeType;
  
  // create moment with associated prompt id and user id
  const promptUserId = await Prompt.findUserIdByPromptId(promptId);
  const moment = await Moment.createMoment({ associatedPromptId: promptId, contributorId: userId, userId: promptUserId });
  await assignMomentToClip(promptId, moment._id.toString(), mimeType);

  console.log('moment made:', moment);
  
  // get the id of the moment
  const momentId = moment._id.toString();
  
  // construct the S3 keys
  const audioKey = `${promptUserId}/audiopcm/${momentId}`;
  const videoKey = `${promptUserId}/video/${momentId}`;
  const thumbnailKey = `${promptUserId}/thumbnail/${momentId}`; // added thumbnailKey
  const proxyKey = `${promptUserId}/proxy/${momentId}`; // added proxyKey
  
  
  console.log(audioKey, videoKey, thumbnailKey, proxyKey); // added thumbnailKey to console.log
  
  // attach the keys to the req object
  req.s3Keys = { audioKey, videoKey, thumbnailKey, proxyKey, momentId }; // added thumbnailKey to req.s3Keys
  
  next();
};

export default createMomentAndGenerateS3Keys;