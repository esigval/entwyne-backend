import Edit from "../../models/editModel.js";

const renderingOrder = async (storylineId) => {
    const edits = await Edit.getEditsByStorylineId(storylineId);

    // Find all narrative clips and sort by order
    let narrativeClips = edits.filter(edit => edit.beatType === 'narrative').sort((a, b) => a.order - b.order);
    let bRollClips = edits.filter(edit => edit.beatType === 'b-roll').sort((a, b) => a.order - b.order);

    let renderingOrder = [];
    let bRollIndex = 0;

    narrativeClips.forEach((narrativeClip, index) => {
        renderingOrder.push({ 
            _id: narrativeClip._id, 
            newOrder: renderingOrder.length, 
            filePath: narrativeClip.filePath,
            beatType: narrativeClip.beatType,
            mediaType: narrativeClip.mediaType,
            duration: narrativeClip.duration
        });  // Include beatType and mediaType
    
        let bRollsToInsert = Math.ceil(bRollClips.length / (narrativeClips.length - index));
        while (bRollsToInsert > 0 && bRollIndex < bRollClips.length) {
            renderingOrder.push({ 
                _id: bRollClips[bRollIndex]._id, 
                newOrder: renderingOrder.length, 
                filePath: bRollClips[bRollIndex].filePath,
                beatType: bRollClips[bRollIndex].beatType,
                mediaType: bRollClips[bRollIndex].mediaType,
                duration: bRollClips[bRollIndex].duration
            });  // Include beatType and mediaType
            bRollIndex++;
            bRollsToInsert--;
        }
    });
    
    while (bRollIndex < bRollClips.length) {
        renderingOrder.push({ 
            _id: bRollClips[bRollIndex]._id, 
            newOrder: renderingOrder.length, 
            filePath: bRollClips[bRollIndex].filePath,
            beatType: bRollClips[bRollIndex].beatType,
            mediaType: bRollClips[bRollIndex].mediaType
        });  // Include beatType and mediaType
        bRollIndex++;
    }
    return renderingOrder;  // This now contains the ordered list of edit _ids
};

export default renderingOrder;


