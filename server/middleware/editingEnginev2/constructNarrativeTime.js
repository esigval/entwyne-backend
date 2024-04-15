import fetchNarrativeBlockTemplates from './fetchNarrativeBlockTemplates.js';

const constructNarrative = async (rawNarrative) => {
    const templates = await fetchNarrativeBlockTemplates(rawNarrative); // Dynamic fetch of templates

    // Calculate total min and max duration ranges for all blocks
    const totalDurationRange = rawNarrative.rawNarrative.reduce((acc, blockName) => {
        const template = templates[blockName];
        if (!template) {
            throw new Error(`Template not found for narrative block: ${blockName}`);
        }
        acc.min += template.durationRange.min;
        acc.max += template.durationRange.max;
        return acc;
    }, { min: 0, max: 0 });

    // Calculate the ideal average duration per block, respecting the total target duration
    let narrativeStructure = rawNarrative.rawNarrative.map((blockName, index) => {
        const template = templates[blockName];
        if (!template) {
            throw new Error(`No template found for block name: ${blockName}`);
        }

        const averageDuration = rawNarrative.totalTargetDuration / rawNarrative.rawNarrative.length;
        const suggestedDuration = Math.min(Math.max(averageDuration, template.durationRange.min), template.durationRange.max);

        return {
            part: blockName,
            type: template.type,
            order: index,
            durationRange: template.durationRange,
            suggestedDuration,
            blockInstructions: template.description,
            clipPace: {
                ...template.clipPace,
            }
        };
    });

    let totalSuggestedDuration = narrativeStructure.reduce((acc, block) => acc + block.suggestedDuration, 0);
    let remainder = rawNarrative.totalTargetDuration - totalSuggestedDuration;

    // Function to distribute the remainder
    const distributeRemainder = () => {
        const eligibleBlocks = narrativeStructure.filter(block =>
            block.suggestedDuration > block.durationRange.min && block.suggestedDuration < block.durationRange.max);

        if (eligibleBlocks.length === 0 || remainder === 0) {
            return; // No further adjustments can be made
        }

        const adjustmentPerBlock = remainder / eligibleBlocks.length;

        narrativeStructure = narrativeStructure.map(block => {
            if (block.suggestedDuration > block.durationRange.min && block.suggestedDuration < block.durationRange.max) {
                let newDuration = block.suggestedDuration + adjustmentPerBlock;
                // Ensure new duration is within the block's min/max range
                newDuration = Math.max(block.durationRange.min, Math.min(newDuration, block.durationRange.max));
                remainder -= (newDuration - block.suggestedDuration); // Update remainder
                block.suggestedDuration = newDuration;
            }
            if (block.clipPace.type === "fixed") {
                // If the clip pace is fixed, no calculation is needed.
                block.clipPace = block.clipPace; // Assuming clipPace should be replaced by clipPace
            } else if (block.clipPace.type === "timed" && block.clipPace.bpm) {
                // Calculate the clip pace for timed type
                const secondsPerShot = (block.clipPace.bpm / 60) * block.clipPace.interval; // Assuming there's an 'interval' value
                const millisecondsPerShot = secondsPerShot * 1000;
                const numberOfClips = block.suggestedDuration / millisecondsPerShot;

                // Update the block with calculated clipPace
                block.clipPace = {
                    type: "timed",
                    bpm: block.clipPace.bpm,
                    interval: block.clipPace.interval, // Assuming the need to retain the interval
                    clips: Math.floor(numberOfClips) // Assuming we want whole number of clips
                };
            }
            return block;
        });
    };

    // Initially distribute the remainder
    distributeRemainder();

    // If there's still a remainder due to rounding or max/min constraints, attempt further distribution
    while (remainder !== 0) {
        const previousRemainder = remainder;
        distributeRemainder();
        // If remainder hasn't changed, further distribution is not possible
        if (previousRemainder === remainder) break;
    }

    const constructedNarrative = {
        name: rawNarrative.name,
        theme: rawNarrative.theme,
        totalTargetDuration: rawNarrative.totalTargetDuration,
        structure: narrativeStructure
    };

    return constructedNarrative;
};

export default constructNarrative;

