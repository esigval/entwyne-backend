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
  
    console.log(audioKey, videoKey);
  
    // attach the keys to the req object
    req.s3Keys = { audioKey, videoKey, momentId };
  
    next();
  };

export default createMomentAndGenerateS3Keys;