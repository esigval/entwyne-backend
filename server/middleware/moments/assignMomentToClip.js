import Prompts from '../../models/promptModel.js';
import Storyline from '../../models/storylineModel.js';
import { ObjectId } from 'mongodb';

async function assignMomentToClip(promptId, momentId, mimeType) {
    try {
        const storylineId = await Prompts.getStorylineId(promptId);
        const storyline = await Storyline.findById(storylineId);

        let associatedStructurePart = null;
        for (const structurePart of storyline.structure) {
            if (structurePart.promptId.toString() === promptId) {
                associatedStructurePart = structurePart;
                break;
            }
        }

        if (!associatedStructurePart) {
            throw new Error('Associated structure part not found');
        }

        const { clipPace } = associatedStructurePart;
        const { clipLength, quantity } = clipPace;
        const existingClipsCount = associatedStructurePart.clips.length;
        let newClip = null;

        if (existingClipsCount < quantity) {
            newClip = {
                momentId: new ObjectId(momentId),
                clipLength,
                mediaType: mimeType,
                id: new ObjectId().toString(),
            };
            associatedStructurePart.clips.push(newClip);
            await Storyline.updateClipWithAssignedMoment(storylineId, promptId, newClip);
        }
    } catch (error) {
        console.error('Error in assignMomentToClip:', error);
    }
}

export default assignMomentToClip;

//const result = assignMomentToClip('665fb05ae26a6df154baf389', '662b270594d07d65cfb47cf1');
//console.log(result);