import NarrativeBlock from "../../models/narrativeBlockModel.js";

// Adjusted function to fetch narrative block templates based on name, not type
const fetchNarrativeBlockTemplates = async (narrative) => {
    if (typeof narrative === 'string') {
        narrative = JSON.parse(narrative);
    }

    console.log('narrative:', narrative);
    console.log('Accessing a property:', narrative.name);
    console.log('Accessing nested array:', narrative.rawNarrative);

    // Check if rawNarrative has the expected structure
    if (!narrative || !Array.isArray(narrative.rawNarrative)) {
        console.error('rawNarrative is missing or not structured correctly:', narrative);
        return {};  // Return early if the structure is not as expected
    }

    const narrativeBlocks = narrative.rawNarrative;
    console.log('narrativeBlocks:', narrativeBlocks);
    const bpm = narrative.bpm;
    let templates = {};

    // Iterate over each narrative block object
    for (const block of narrative.rawNarrative) {
        const blockType = block.type; // Get the name of the narrative block

        try {
            // Find the narrative block in the database by name
            const narrativeBlock = await NarrativeBlock.findOne({ name: blockType });

            if (narrativeBlock) {
                // Apply bpm if 'timed' type is used in the clip pace
                if (narrativeBlock.clipPace && narrativeBlock.clipPace.type === 'timed' && bpm) {
                    narrativeBlock.clipPace.bpm = bpm;
                    
                }
                // Store the block using its name as a key in the templates object
                templates[blockType] = narrativeBlock;
            } else {
                console.error(`No template found for narrative block name: ${blockType}`);
            }
        } catch (error) {
            console.error(`Error fetching narrative block for name: ${blockType}:`, error);
        }
    }

    return templates;
};

export default fetchNarrativeBlockTemplates;

