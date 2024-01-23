import { connect } from '../db/db.js'; // Adjust with your actual connection file path
import { ObjectId } from 'mongodb';

class Edit {
    constructor(_id, sourceMediaID, storylineId, filePath, mediaType, startTime, duration, resolution, frameRate, format, audioSettings, filters, overlayData, transitionType, outputPath, userComments, order, metadata, accessPermissions, beatType) {
        this._id = _id;                     // Unique ID for the edit
        this.sourceMediaID = sourceMediaID; // Reference to the original media
        this.storylineId = storylineId;     // Reference to the storyline
        this.filePath = filePath;           // File path or URL of the source media
        this.mediaType = mediaType;         // Type of the media (video, audio, image)
        this.startTime = startTime;         // Start time for the clip
        this.duration = duration;           // Duration of the clip
        this.resolution = resolution;       // Desired resolution for the output
        this.frameRate = frameRate;         // Frame rate for the video
        this.format = format;               // Format of the output file
        this.audioSettings = audioSettings; // Audio settings (bitrate, codec, etc.)
        this.filters = filters;             // FFMPEG filters to be applied
        this.overlayData = overlayData;     // Information about overlays
        this.transitionType = transitionType; // Type of transition between clips
        this.outputPath = outputPath;       // Destination path for the edited media
        this.status = 'pending';            // Default status
        this.timestamps = {                 // Timestamps
            created: new Date(),
            modified: new Date()
        };
        this.userComments = userComments;   // Notes or comments on the edit
        this.order = order;                 // Order in a sequence of clips
        this.metadata = metadata;           // Additional technical metadata
        this.accessPermissions = accessPermissions; // Access permissions
        this.beatType = beatType;           // Type of beat (e.g., 'narrative', 'b-roll')
    }

    static get collectionName() {
        return 'edits'; // Name of the collection in the database
    }

    static async saveEditsToDatabase(edits) {
        try {
            const db = await connect();
            const collection = db.collection(Edit.collectionName);

            // Inserting each edit into the database
            for (const edit of edits) {
                await collection.insertOne(edit);
            }

        } catch (e) {
            console.error(e);

        }
    }



    static async getEditsByStorylineId(storylineId) {

        try {
            const db = await connect();
            const collection = db.collection(Edit.collectionName);
    
            if (ObjectId.isValid(storylineId)) {
                storylineId = new ObjectId(storylineId);
            } else if (!isNaN(storylineId)) {
                storylineId = storylineId;
            } else {
                throw new Error('Invalid storylineId');
            }
    
            const documents = await collection.find({ storylineId }).toArray();
            return documents.map(document => {
                return new Edit(
                    document._id,
                    document.sourceMediaID,
                    document.storylineId,
                    document.filePath,
                    document.mediaType,
                    document.startTime,
                    document.duration,
                    document.resolution,
                    document.frameRate,
                    document.format,
                    document.audioSettings,
                    document.filters,
                    document.overlayData,
                    document.transitionType,
                    document.outputPath,
                    document.userComments,
                    document.order,
                    document.metadata,
                    document.accessPermissions,
                    document.beatType
                );
            });
    
        } catch (e) {
            console.error(e);
        }
    }
    
    
}



export default Edit;

