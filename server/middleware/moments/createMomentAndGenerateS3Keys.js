import Moment from '../../models/momentModel.js';

const createMomentAndGenerateS3Keys = async (req, res, next) => {
  const userId = req.userId;
  const { promptId } = req.params; 
  
  // create moment
  const moment = await Moment.createMoment({ associatedPromptId: promptId, userId });
  
  // get the id of the moment
  const momentId = moment._id.toString();
  
  // construct the S3 keys
  const audioKey = `${userId}/audiopcm/${momentId}`;
  const videoKey = `${userId}/video/${momentId}`;
  const thumbnailKey = `${userId}/thumbnail/${momentId}`; // added thumbnailKey
  const proxyKey = `${userId}/proxy/${momentId}`; // added proxyKey
  
  console.log(audioKey, videoKey, thumbnailKey, proxyKey); // added thumbnailKey to console.log
  
  // attach the keys to the req object
  req.s3Keys = { audioKey, videoKey, thumbnailKey, proxyKey, momentId }; // added thumbnailKey to req.s3Keys
  
  next();
};

export default createMomentAndGenerateS3Keys;