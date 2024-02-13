import { connect } from './db.js';

const storeTranscription = async (transcription, associatedPromptId) => {
  const db = await connect();
  const collection = db.collection('twynes');

  // Use associatedPromptId as the filter
  const filter = { associatedPromptId: associatedPromptId };

  // Set new values here
  const update = {
    $set: {
      ...transcription
    },
  };

  const result = await collection.updateOne(filter, update);
  return result;
};

export default storeTranscription;