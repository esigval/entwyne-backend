import Moment from '../../../models/momentModel.js';
import Prompt from '../../../models/promptModel.js';

const createInviteMomentAndGenerateS3Keys = async (req, res, next) => {
  54
  const userId = req.userId;
  console.log('User ID:', userId);
  const { promptId } = req.params; 
  
  // Create moment with associated prompt id and user id
  const promptUserId = await Prompt.findUserIdByPromptId(promptId);
  const momentData = {
    associatedPromptId: promptId, 
    userId: promptUserId
  };
  
  // Add contributorId to momentData only if userId is available
  if (userId) {
    momentData.contributorId = userId;
  }

  const moment = await Moment.createMoment(momentData);

  console.log('Moment created:', moment);
  
  // Get the id of the moment
  const momentId = moment._id.toString();
  
  // Construct the S3 keys for images and videos
  const imageKey = `${promptUserId}/images/${momentId}`;  // Generic key for all image uploads
  const videoKey = `${promptUserId}/videos/${momentId}`;  // Specific key for video uploads
  
  console.log('Image key:', imageKey, 'Video key:', videoKey);
  
  // Attach the keys to the req object
  req.s3Keys = { imageKey, videoKey, momentId };
  
  next();
};

export default createInviteMomentAndGenerateS3Keys;