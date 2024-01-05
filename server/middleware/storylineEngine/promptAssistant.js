import StorylineTemplate  from "../../models/storylineTemplateModel.js";
import fetchAndSummarizeThread from "./fetchAndSummarizeThread.js";
import transformStoryToPrompts from "./transformStoryToPrompts.js";
import createPromptAndStorylineObjects from "./convertDirectorTemplatetoPrompts.js";

const instructions = `This GPT is a data transformer. You will analyze an existing interview between a user and another assistant, and from that synthesize an output of prompts, using a story template as a guide for the structure of the output. The output needs to be formatted precisely, in json, to match the existing order of the template. It should be pure json, do not use markdown. You will only produce these outputs, and only say something else if you notice and error or think something is wrong. Keep it brief if so. Otherwise, the prompts will have the instructions as sits below. The language inside the prompts should be targeted to the audience, personable, and no more than a sentence or two.

Here is the output (an array for each item that matches the template), The order should correspond to the original template that will be provided. The output json should be purely json, no markdown.
{
    "order": 1,
    "prompt": "{ should be a prompt to the user on what to capture }",
    "promptTitle": "{ should be summary of the prompt in 3 words }"
},

I am appending the thread history and template below.`;
const storyId = "6597317a5bb7186ccbfdbe57";
const threadId = "thread_mHDfRId0Bq5JCtPfw0Hfs0aO";
const templateName = "What I Love About You";


async function testRun(instructions, storyId, threadId, templateName) {
    
    try {
        // Access template Parts
        const templateParts = await StorylineTemplate.getStorylineTemplateParts(templateName);
        
        // Create a run on the existing thread
        const threadHistory = await fetchAndSummarizeThread(threadId); // Implement this function

        // Give threadHistory to chat completions to create output
        const promptJson = await transformStoryToPrompts(instructions, threadHistory, templateParts); // Implement this function

        // Convert promptJson to database entries and storyline objects
        const dataFeed = await createPromptAndStorylineObjects(promptJson, storyId, templateName); // Implement this function
        console.log("Formatted Output:", dataFeed);
    } catch (error) {
        console.error('Error:', error);
    }
}

testRun(instructions, storyId, threadId, templateName);

