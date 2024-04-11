import Twyne from "../../models/twyneModel.js";
import Storyline from "../../models/storylineModel.js";
import generateInstructions from './generateInstructions.js';
import parseBlockInstructions from './parseBlockInstructions.js';
import updateNarrativeStylesWithInstructions from './updateNarrativeStylesWithInstructions.js';
import linkStorylineToTwyne from './linkFields.js';
import constructNarrative from './constructNarrative.js';
import sceneDirectorLlm from './llms/sceneDirectorLlm.js';
import rawNarrative from './rawDataTests/narrativeStructureRequest.json' assert { type: 'json' };
import generateAndStorePrompts from './editing/generatePromptsandStorev2.js';
import ProgressBar from 'progress';


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
    const bar = new ProgressBar(':bar', { total: 8 });

    console.time('Processing Time');
    // Fetch documents from the database
    const twyne = await Twyne.findById(twyneId);
    bar.tick();

    console.log('Generating instructions...');
    const constructedNarrative = await constructNarrative(rawNarrative);
    const instructions = await generateInstructions(twyne.storySummary, constructedNarrative);
    bar.tick();

    console.log('Parsing block instructions...');
    const parsedInstructions = await parseBlockInstructions(instructions);
    bar.tick();

    console.log('Updating narrative styles with instructions...');
    const storylineInstance = await updateNarrativeStylesWithInstructions(constructedNarrative, parsedInstructions);
    bar.tick();

    console.log('Running scene director...');
    const sceneDirectorOutput = await sceneDirectorLlm(twyne.storySummary, storylineInstance);
    bar.tick();

    console.log('Generating and storing prompts...');
    const promptStorylineInstance = await generateAndStorePrompts(twyneId, twyne.storySummary.storyId, twyne.storySummary.storyline, userId, sceneDirectorOutput);
    bar.tick();

    console.log('Creating storyline instance...');
    const insertedId = await Storyline.createStorylineInstance(promptStorylineInstance);
    bar.tick();

    console.log('Linking storyline to Twyne...');
    await linkStorylineToTwyne(twyneId, userId, insertedId);
    bar.tick();

    console.log('Process completed.');
    console.timeEnd('Processing Time');
}

export default processNarrative;

// Testing Script
processNarrative('65f13b5b3c54a131c18aed0a', rawNarrative, '660d81337b0c94b81b3f1744');