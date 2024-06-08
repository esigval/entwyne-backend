import Prompts from '../../../models/promptModel.js';
import Moment from '../../../models/momentModel.js';
import Storyline from '../../../models/storylineModel.js';

async function extractClipData(storylineId) {
    const data = await Storyline.findById(storylineId)

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
            let clipData = {
                orderIndex: `${index}.${clipIndex}`,
                type: clip.type,
                partType: part.type,
                promptId: part.promptId, // Moved promptId to be accessed from part
                momentId: clip.momentId, // Access momentId directly from clip
                length: parseInt(clip.clipLength),
                cutSpeed: part.clipPace.type === 'fixed' ? 'flexible' : part.clipPace.type
            };

            // Add proxy URIs to clipData
            const proxyUris = proxyUrisMap[clipData.momentId];
            if (proxyUris) {
                clipData.proxyUri = proxyUrisMap[clipData.momentId.toString()];
            }

            // Add the clip data to the clips array for this block
            block.clips.push(clipData);
        }

        // Add the block to the results array
        results.push(block);
    }
    return results;
}

export default extractClipData;

/*
// Get the extracted clip data
extractClipData('662adef494d07d65cfb47cce').then(clipData => {
    console.log(JSON.stringify(clipData, null, 2));
}).catch(error => {
    console.error('Error extracting clip data:', error);
});*/