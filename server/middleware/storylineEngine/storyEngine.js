import StorylineTemplate  from "../../models/storylineTemplateModel.js";
import fetchAndSummarizeThread from "./fetchAndSummarizeThread.js";
import transformStoryToPrompts from "./transformStoryToPrompts.js";
import createPromptAndStorylineObjects from "./createPromptAndStorylineObjects.js";

const storyEngine = async (instructions, storyId, threadId, templateName) => {
    console.log('instructions:', instructions);
    console.log('storyId:', storyId);
    console.log('threadId:', threadId);
    console.log('templateName:', templateName);
    
    try {
        // Access template Parts
        
        const templateParts = await StorylineTemplate.getStorylineTemplateParts(templateName);
        const template = await StorylineTemplate.getTemplateDetails(templateName);
        
        // Create a run on the existing thread
        const threadHistory = await fetchAndSummarizeThread(threadId); // Implement this function

        // Give threadHistory to chat completions to create output
        const promptJson = await transformStoryToPrompts(instructions, threadHistory, templateParts, template); // Implement this function

        // const primers = await transformPromptsToPrimers(threadHistory, promptJson, template); // Implement this function

        // Convert promptJson to database entries and storyline objects
        const dataFeed = await createPromptAndStorylineObjects(promptJson, storyId, templateName); // Implement this function
        return dataFeed;
    } catch (error) {
        console.error('Error:', error);
    }
}

export default storyEngine;

