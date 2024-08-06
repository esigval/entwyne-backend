import Moment from '../../models/momentModel.js';
import Prompt from '../../models/promptModel.js';
import assignMomentToClip from './assignMomentToClip.js';

const createMomentAndGenerateS3Keys = async (req, res, next) => {
  const userId = req.userId;
  const { promptId } = req.params;
  const mimeType = req.body.mimeType;

  // create moment with associated prompt id and user id
  const { userId: promptUserId, storylineId } = await Prompt.findUserIdAndStorylineByPromptId(promptId);
  const moment = await Moment.createMoment({
    associatedPromptId: promptId,
    contributorId: userId, // Assuming this is defined elsewhere in your code
    userId: promptUserId,
    storylineId: storylineId, // Add storylineId to the moment creation if your schema supports it
    mediaType: mimeType,
  });
  await assignMomentToClip(promptId, moment._id.toString(), mimeType);

  console.log('moment made:', moment);

  // get the id of the moment
  const momentId = moment._id.toString();

  // construct the S3 keys
  const audioKey = `${promptUserId}/audiopcm/${momentId}`;
  const videoKey = `${promptUserId}/video/${momentId}`;
  const imageKey = `${promptUserId}/image/${momentId}`;
  const thumbnailKey = `${promptUserId}/thumbnail/${momentId}`; // added thumbnailKey
  const proxyKey = `${promptUserId}/proxy/${momentId}`; // added proxyKey

  const update = {
    audioKey,
    videoKey,
    imageKey,
    thumbnailKey, // added thumbnailKey
    proxyKey, // added proxyKey
};

  // Update the moment
  await Moment.updateMoment({
    momentId,
    update
  });


  console.log(audioKey, videoKey, imageKey, thumbnailKey, proxyKey); // added thumbnailKey to console.log

  // attach the keys to the req object
  req.s3Keys = { audioKey, videoKey, imageKey, thumbnailKey, proxyKey, momentId }; // added thumbnailKey to req.s3Keys

  next();
};

export default createMomentAndGenerateS3Keys;