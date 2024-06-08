import Twyne from "../../models/twyneModel.js";
import Storyline from "../../models/storylineModel.js";
import Story from "../../models/storyModel.js";
import generateInstructions from './generateInstructions.js';
import parseBlockInstructions from './parseBlockInstructions.js';
import updateNarrativeStylesWithInstructions from './updateNarrativeStylesWithInstructions.js';
import linkStorylineToTwyne from './linkFields.js';
import constructNarrative from './constructNarrative.js';
import sceneDirectorLlm from './llms/sceneDirectorLlm.js';
import rawNarrative from './rawDataTests/testPayload.json' assert { type: 'json' };
import generateAndStorePrompts from './editing/generatePromptsandStorev3.js';
import ProgressBar from 'progress';
import validateNarratives from "./llms/confirmationAgent.js";


/**
 * processNarrative is an asynchronous function that processes a narrative.
 * It fetches documents from the database, generates instructions, parses block instructions,
 * updates narrative styles with instructions, runs the scene director, generates and stores prompts,
 * creates a storyline instance, and links the storyline to Twyne. It also logs the progress and time taken for these operations.
 *
 * @param {string} twyneId - The ID of the Twyne document to be processed.
 * @param {Object} rawNarrative - The raw narrative data to be processed.
 * @param {string} userId - The ID of the user who initiated the process.
 *
 * @returns {void}
 */


async function processNarrative(twyneId, rawNarrative, userId) {
    try {
        const bar = new ProgressBar(':bar', { total: 8 });
        console.log("raw narrative outside the block", rawNarrative);

        console.time('Processing Time');
        // Fetch documents from the database
        const twyne = await Twyne.findById(twyneId);
        console.log("twyne", twyne);
        const story = await Story.findById(twyne.storyId);
        console.log("story", story);
        bar.tick();

        console.log('Generating instructions...');
        const validatedNarratives = await validateNarratives(rawNarrative);

        const constructedNarrative = await constructNarrative(validatedNarratives);
        // const instructions = await generateInstructions(twyne.storySummary, constructedNarrative);
        console.log("constructed narrative", constructedNarrative);
        bar.tick();

        console.log('Parsing block instructions...');
        // const parsedInstructions = await parseBlockInstructions(instructions);
        bar.tick();

        console.log('Updating narrative styles with instructions...');
        // const storylineInstance = await updateNarrativeStylesWithInstructions(constructedNarrative, parsedInstructions);
        bar.tick();

        console.log('Running scene director...');
        // const sceneDirectorOutput = await sceneDirectorLlm(twyne.twyneSummary, constructedNarrative, story.storySummary);
        bar.tick();

        console.log('Generating and storing prompts...');
        const promptStorylineInstance = await generateAndStorePrompts(twyneId, twyne.storyId, twyne.storyline, userId, constructedNarrative);

        bar.tick();

        console.log('Creating storyline instance...');
        const insertedId = await Storyline.createStorylineInstance(promptStorylineInstance);
        bar.tick();

        console.log('Linking storyline to Twyne...');
        await linkStorylineToTwyne(twyneId, insertedId);
        bar.tick();

        const totalClips = await Storyline.getTotalParts(insertedId);
        const message = `We've created ${totalClips} Tasks based on your request. Check out your Tasks to see what has been made!`;
        console.log(message);

        console.log('Process completed.');
        console.timeEnd('Processing Time');

        return message;
    } catch (error) {
        console.error('An error occurred during the narrative processing:', error);
    }
}

export default processNarrative;

// Testing Script
//processNarrative('661edb7d8efc37640c3d451a', rawNarrative, '660d81337b0c94b81b3f1744');