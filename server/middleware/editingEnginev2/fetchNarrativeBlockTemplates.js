import NarrativeBlock from "../../models/narrativeBlockModel.js";

// Adjusted function to fetch narrative block templates by type
const fetchNarrativeBlockTemplates = async (rawNarrative) => {
    const bpm = rawNarrative.bpm;
    let templates = {};

    // Assuming each block name in rawNarrative.rawNarrative array corresponds to a type
    for (const typeName of rawNarrative.rawNarrative) {
        try {
            const blocksByType = await NarrativeBlock.findByType(typeName);

            blocksByType.forEach(block => {
                // Apply bpm if 'timed' type is used
                if (block.clipPace && block.clipPace.type === 'timed' && bpm) {
                    block.clipPace.bpm = bpm; // Adjust bpm dynamically
                }
                // Store the block using its name as a key
                templates[block.name] = block;
            });

        } catch (error) {
            console.error(`Error fetching narrative block for type: ${typeName}:`, error);
        }
    }

    return templates;
};

export default fetchNarrativeBlockTemplates;