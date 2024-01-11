import { connect } from '../db/db.js'; // Adjust with your actual connection file path
import { ObjectId } from 'mongodb';

class StorylineModel {
    constructor({
        _id = new ObjectId(),
        storyId,
        storylineParts = []
    }) {
        this._id = _id;
        this.storyId = storyId;
        this.storylineParts = storylineParts;
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


}

export default StorylineModel;



