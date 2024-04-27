import Prompts from '../../models/promptModel.js';
import Moment from '../../models/momentModel.js';
import Storyline from '../../models/storylineModel.js';

async function extractClipData(storylineId) {
    const data = await Storyline.getStorylineById(storylineId)
    console.log("Data:", data);

    // Initialize an empty array to hold the results
    let results = [];

    // Get the map of proxy URIs
    const proxyUrisMap = await Moment.getProxyUrisMap();

    for (const [index, part] of data.structure.entries()) {
        // Initialize an object for this narrative block
        let block = {
            partType: part.type,
            orderIndex: index,
            clips: []
        };

        for (const [clipIndex, clip] of part.clips.entries()) {
            console.log("Clip:", clip); // Debug log

            if (clip.promptId) {
                let clipData = {
                    orderIndex: `${index}.${clipIndex}`,
                    type: clip.type,
                    partType: part.type,
                    promptId: clip.promptId,
                    length: parseInt(clip.length),
                    cutSpeed: part.clipPace.type === 'fixed' ? 'flexible' : part.clipPace.type
                };
                // Add momentId to clipData
                const momentIds = await Prompts.findMomentIdsByPromptIds([clipData.promptId]);
                clipData.momentId = momentIds[0]; // Assuming each promptId corresponds to one momentId

                // Add proxy URIs to clipData
                const proxyUris = proxyUrisMap[clipData.momentId];
                if (proxyUris) {
                    clipData.proxyUri = proxyUrisMap[clipData.momentId.toString()];
                }

                // Add the clip data to the clips array for this block
                block.clips.push(clipData);
            }
        }

        // Add the block to the results array
        results.push(block);
    }
    return results;
}

// Get the extracted clip data
extractClipData('662adef494d07d65cfb47cce').then(clipData => {
    console.log(JSON.stringify(clipData, null, 2));
}).catch(error => {
    console.error('Error extracting clip data:', error);
});