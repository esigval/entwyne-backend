import Storyline from '../models/storyModel.js' // Replace with your actual model path

async function findThreadByStoryId(storyId) {
  try {
    const story = await Storyline.findById(storyId); // Pass the storyId directly
    return story.threadId; // Assuming the story model has a 'threadId' field
  } catch (error) {
    console.error('Error finding story:', error);
    throw error;
  }
}


export default findThreadByStoryId;