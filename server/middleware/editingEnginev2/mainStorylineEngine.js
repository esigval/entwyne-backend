import generateInstructions from './generateInstructions.js';
import parseBlockInstructions from './parseBlockInstructions.js';
import updateNarrativeStylesWithInstructions from './updateNarrativeStylesWithInstructions.js';
import linkStorylineToTwyne from './linkFields.js';


async function processNarrative(twyneId, narrativeTemplateName) {
    // Generate instructions
    const instructions = await generateInstructions(twyneId, narrativeTemplateName);

    // Parse block instructions
    const parsedInstructions = await parseBlockInstructions(instructions);

    const insertedId = await updateNarrativeStylesWithInstructions(narrativeTemplateName, parsedInstructions);

    // Tomorrow we add the feature to expand the individual storyBlocks with Edit level instructions

    // We expand those edit level blocks into prompts, associated with the TwyneId

    await linkStorylineToTwyne(twyneId, insertedId);
}


// Run the main function with your specific parameters
processNarrative('65f13b5b3c54a131c18aed0a', 'Adventure Narrative Style');