import rawNarrative from '../editingEnginev2/rawDataTests/testPayload.json' assert { type: "json" };
import fetchNarrativeBlockTemplates from './fetchNarrativeBlockTemplates.js';
import Storyline from '../../models/storylineModel.js';

const constructNarrative = async (rawNarrative) => {
    if (typeof rawNarrative === 'string') {
        rawNarrative = JSON.parse(rawNarrative);
    }
    const templates = await fetchNarrativeBlockTemplates(rawNarrative); // Dynamic fetch of templates

    // Adjusting logic to use the expanded narrative block structure
    let narrativeStructure = rawNarrative.rawNarrative.map((block, index) => {
        const template = templates[block.type]; // Fetch template by block name
        if (!template) {
            throw new Error(`Template not found for narrative block: ${block.type}`);
        }

        const bpm = 60;

        let quantity = null; // Initialize quantity as null
        let clipTime = null; // Initialize clipTime as null

        if (template.clipPace.type === 'timed') {
            // Calculate clipTime and quantity
            clipTime = (60 / bpm) * template.clipPace.interval;
            quantity = Math.round(block.duration /clipTime ); // Update quantity if type is 'timed'
        } else if (template.clipPace.type === 'fixed') {
            // If type is 'fixed', inherit quantity from the template
            clipTime = block.duration;
            quantity = template.clipPace.quantity;
        }

        // Save quantity to clipPace.quantity field
        block.quantity = quantity;

        return {
            part: block.name,
            sceneInstructions: block.description,
            type: block.type, // Assuming type data is useful, pulled from the raw narrative
            order: index,
            durationRange: template.durationRange,
            suggestedDuration: block.duration, // Use the duration specified in the input directly
            targetedDuration: block.duration * 1000, // Assuming this exists in your template
            blockInstructions: template.description,
            clipPace: {
                ...template.clipPace, // Spread the existing clipPace object
                quantity: quantity, // Add the quantity property
                clipLength: clipTime // Add the clipPace property
            }
        };
    });

    // Calculate total suggested duration directly from the rawNarrative input
    let totalSuggestedDuration = narrativeStructure.reduce((acc, block) => acc + block.suggestedDuration, 0);
    let remainder = rawNarrative.totalTargetDuration - totalSuggestedDuration;

    // Simplify the distributeRemainder function since direct durations are used
    const distributeRemainder = () => {
        narrativeStructure.forEach(block => {
            // Adjust durations proportionally if remainder is positive or negative
            let proportion = block.suggestedDuration / totalSuggestedDuration;
            block.suggestedDuration += Math.ceil(remainder * proportion); // Distributing the remainder proportionally
            block.suggestedDuration = Math.max(block.durationRange.min, Math.min(block.suggestedDuration, block.durationRange.max)); // Ensuring within range
        });
        remainder = 0; // Set remainder to 0 after distribution
    };

    // Distribute the remainder if any
    if (remainder !== 0) {
        distributeRemainder();
    }

    const constructedNarrative = new Storyline({
        _id: undefined, // Omit _id
        name: rawNarrative.name,
        theme: rawNarrative.theme,
        totalTargetDuration: rawNarrative.totalTargetDuration,
        structure: narrativeStructure
    });

    return constructedNarrative;
};

export default constructNarrative;

