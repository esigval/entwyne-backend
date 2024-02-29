import { connect } from '../db/db.js'; // Adjust with your actual connection file path
import { ObjectId } from 'mongodb';

class StorylineModel {
    constructor({
        _id = new ObjectId(),
        storyId,
        storylineParts = [],
        bRoll = [],
        videoSettings,
        finalRender,
        userId,
    }) {
        this._id = _id;
        this.storyId = new ObjectId(storyId);
        this.storylineParts = storylineParts;
        this.bRoll = bRoll;
        this.videoSettings = videoSettings;
        this.finalRender = finalRender;
        this.userId = new ObjectId(userId);
    }


    static get collectionName() {
        return 'storylines'; // Name of the collection in the database
    }

    getStorylineParts() {
        return this.storylineParts;
    }

    static async findById(id) {
        try {
            const db = await connect();
            const collection = db.collection(StorylineModel.collectionName);
            const document = await collection.findOne({ _id: new ObjectId(id) });
            return document ? new StorylineModel(document) : null;
        } catch (error) {
            console.error("Error in StorylineModel.findById:", error);
            throw error;
        }
    }

    static async create(data) {
        try {
            const db = await connect();
            const collection = db.collection(StorylineModel.collectionName);
            const result = await collection.insertOne(data);
            // Use the insertedId to construct the new object
            return new StorylineModel({ ...data, _id: result.insertedId });
        } catch (error) {
            console.error("Error in StorylineModel.create:", error);
            throw error;
        }
    }


    static async updateStorylinePartWithPromptId(storylineId, order, promptId) {
        try {
            const db = await connect();
            const collection = db.collection(StorylineModel.collectionName);

            // Update the specific storyline part with the promptId
            const updateResult = await collection.updateOne(
                { _id: storylineId, "storylineParts.order": order }, // Ensure field names are consistent
                { $set: { "storylineParts.$.promptId": promptId } }  // Correct use of the $ operator
            );

            return updateResult;
        } catch (error) {
            console.error("Error in StorylineModel.updateStorylinePartWithPromptId:", error);
            throw error;
        }
    }

    static async updateBrollWithMomentId(storylineId, fileType, bRollShotLength, momentId, s3FilePath, s3Uri) {
        try {
            const db = await connect();
            const collection = db.collection(StorylineModel.collectionName);

            // Convert storylineId and momentId from string to ObjectId
            const objectId = new ObjectId(storylineId);
            const objectMomentId = new ObjectId(momentId);

            // Get the storyline document
            const storyline = await collection.findOne({ _id: objectId });

            // Initialize bRoll array if it doesn't exist
            if (!storyline.bRoll) {
                storyline.bRoll = [];
            }
            const currentLength = storyline.bRoll.length;

            // The next order number is currentLength + 1
            const order = currentLength + 1;

            // Update the specific bRoll part with the new entry
            const updateResult = await collection.updateOne(
                { _id: objectId },
                {
                    $push: {
                        "bRoll": {
                            order: order,
                            momentId: objectMomentId,
                            shotLength: bRollShotLength,
                            fileType: fileType,
                            s3FilePath: s3FilePath,
                            s3Uri: s3Uri
                        }
                    }
                },
                { upsert: true } // This will create a new document if it doesn't exist, which may or may not be desired
            );
            // Check if the update was successful
            if (updateResult.modifiedCount === 0 && updateResult.upsertedCount === 0) {
                throw new Error('Update failed or no document was upserted.');
            }

            // Construct the bRoll object to return
            const bRollData = {
                order: order,
                momentId: objectMomentId,
                shotLength: bRollShotLength,
                fileType: fileType,
                s3FilePath: s3FilePath,
                s3Uri: s3Uri
            };

            return {
                updateResult: updateResult,
                bRollData: bRollData
            };
        } catch (error) {
            // Handle error
            console.error("Error updating bRoll: ", error);
        }
    }

    static async updateStorylinePartWithS3Url(storylineId, promptId, s3FilePath, s3UriPath, momentId) {
        try {
            const db = await connect();
            const collection = db.collection(StorylineModel.collectionName);

            // Update the specific storyline part with the s3FilePath and s3UriPath
            const updateResult = await collection.updateOne(
                { _id: new ObjectId(storylineId), "storylineParts.promptId": new ObjectId(promptId) },
                { $set: { "storylineParts.$.s3FilePath": s3FilePath, "storylineParts.$.s3UriPath": s3UriPath, "storylineParts.$.momentId": new ObjectId(momentId) } }
            );

            return updateResult;
        } catch (error) {
            console.error("Error in StorylineModel.updateStorylinePartWithS3Url:", error);
            throw error;
        }
    }

    static async updateStorylineWithFinalRender(storylineId, finalRenderUrl) {
        try {
            const db = await connect();
            const collection = db.collection(StorylineModel.collectionName);
    
            // Update the specific storyline with the finalRenderUrl
            const updateResult = await collection.updateOne(
                { _id: new ObjectId(storylineId) },
                { $set: { finalRender: finalRenderUrl } }
            );
    
            return updateResult;
        } catch (error) {
            console.error("Error in StorylineModel.updateStorylineWithFinalRender:", error);
            throw error;
        }
    }

    static async findFinalRender(storylineId) {
        try {
            const db = await connect();
            const collection = db.collection(StorylineModel.collectionName);
            const document = await collection.findOne({ _id: new ObjectId(storylineId) });
            return document ? new StorylineModel(document) : null;
        } catch (error) {
            console.error("Error in StorylineModel.findFinalRender:", error);
            throw error;
        }
    }

    static async findStorylineByStoryId(storyId) {
        try {
            const db = await connect();
            const collection = db.collection(StorylineModel.collectionName);
            const document = await collection.findOne({ storyId: storyId }); // Remove new ObjectId()
            return document ? new StorylineModel(document) : null;
        } catch (error) {
            console.error("Error in StorylineModel.findStorylineByStoryId:", error);
            throw error;
        }
    }

    static async findStorylineByPromptId(promptId) {
        try {
            const db = await connect();
            const collection = db.collection(StorylineModel.collectionName);
            const document = await collection.findOne({ "storylineParts.promptId": new ObjectId(promptId) });
            return document ? new StorylineModel(document) : null;
        } catch (error) {
            console.error("Error in StorylineModel.findStorylineByPromptId:", error);
            throw error;
        }
    }

    




}

export default StorylineModel;



