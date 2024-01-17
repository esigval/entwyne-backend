import { ObjectId } from 'mongodb';
import { videoConfig } from './videoConfig.js'; // Importing the video config
import Edit from '../../models/editModel.js'; // Assuming Edit class is in Edit.js
import StorylineModel from '../../models/storylineModel.js'; // Assuming StorylineModel class is in StorylineModel.js



// Example usage
async function main() {
    try {
        const storylineId = new ObjectId('65a59778e91d4c46ebf40ed5'); // Ensure this is ObjectId
        const storylineDocument = await StorylineModel.findById(storylineId);

        if (!storylineDocument) {
            throw new Error('Storyline not found');
        }

        const edits = transformStorylineToEdits(storylineDocument);
        await Edit.saveEditsToDatabase(edits);
        console.log('Edits saved to database:', edits);
    } catch (error) {
        console.error('Error in main:', error);
    }
}

main();

const transformStorylineToEdits = (storyline) => {
    const edits = [];
    const storylineId = storyline._id['$oid'] ? storyline._id['$oid'] : storyline._id;
    console.log(`storylineId`, storylineId);

    // Process storyline parts
    storyline.storylineParts.forEach(part => {
        const twyneId = part.twyneId['$oid'] ? part.twyneId['$oid'] : part.twyneId;  // Handle both direct ObjectId and object with $oid
        const edit = new Edit(
            part._id, 
            twyneId, // sourceMediaID
            storylineId,    // storylineId
            part.s3FilePath,      // filePath
            part.mediaType,       // mediaType
            0,                    // startTime (assuming start from beginning)
            part.suggestedLength, // duration
            null,                 // resolution (not specified)
            videoConfig.defaultFrameRate, // frameRate
            videoConfig.defaultFormat,    // format
            null,                 // audioSettings (not specified)
            null,                 // filters (not specified)
            null,                 // overlayData (not specified)
            videoConfig.defaultTransitionType, // transitionType
            null,                 // outputPath (not specified)
            null,                 // userComments (not specified)
            part.order,           // order
            null,                 // metadata (not specified)
            null,                 // accessPermissions (not specified)
            'narrative'           // beatType
        );
        edits.push(edit);
    });

    // Process bRollo8y
    storyline.bRoll.forEach(broll => {
        const twyneId = broll.twyneId['$oid'] ? broll.twyneId['$oid'] : broll.twyneId;  // Handle both direct ObjectId and object with $oid
        const edit = new Edit(
            broll._id,
            twyneId, // sourceMediaID
            storylineId,     // storylineId
            broll.s3FilePath,      // filePath
            broll.fileType,        // mediaType
            0,                     // startTime (assuming start from beginning)
            broll.shotLength,      // duration
            null,                  // resolution (not specified)
            videoConfig.defaultFrameRate, // frameRate
            videoConfig.defaultFormat,    // format
            null,                  // audioSettings (not specified)
            null,                  // filters (not specified)
            null,                  // overlayData (not specified)
            videoConfig.defaultTransitionType, // transitionType
            null,                  // outputPath (not specified)
            null,                  // userComments (not specified)
            broll.order,           // order
            null,                  // metadata (not specified)
            null,                  // accessPermissions (not specified)
            'b-roll'               // beatType
        );
        edits.push(edit);
    });

    return edits;
}

// Compare to this object and make sure we're aligning properly: 

