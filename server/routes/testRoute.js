import Story from '../models/storyModel.js'; 

async function run() {
    const threadId = 'thread_HHiaMBOtQ2Ch0W2D5RKXdu4e';

    const updatedStory = await Story.findByThreadId(threadId);
    console.log('updatedStory:', updatedStory); 
}

run().catch(console.error);