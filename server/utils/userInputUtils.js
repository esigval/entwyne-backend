import Storyline from '../models/storyModel.js' // Replace with your actual model path
import { checkRun } from './assistantFunctions.js'; // Replace with your actual path

async function findThreadByStoryId(storyId) {
  try {
    const story = await Storyline.findById(storyId); // Pass the storyId directly
    return story.threadId; // Assuming the story model has a 'threadId' field
  } catch (error) {
    console.error('Error finding story:', error);
    throw error;
  }
}

// Utility function to delay a certain amount of time
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// Function to poll the run status until it's actionable or terminated
const pollRunStatus = async (threadId, runId) => {
  let runStatus;
  while (true) {
    runStatus = await checkRun(threadId, runId);
    if (runStatus.status === 'requires_action' || runStatus.status === 'cancelled' || runStatus.status === 'failed' || runStatus.status === 'completed') {
      break; // Exit the loop if we reach a conclusive status
    }
    await delay(250); // Wait for 250ms before checking again
  }
  return runStatus;
};

export { findThreadByStoryId, delay, pollRunStatus };