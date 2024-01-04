import { connect } from '../db/db.js'; // Adjust with your actual connection file path
import { ObjectId } from 'mongodb';

class Prompts {
    constructor({
        order,
        storyName,
        prompt,
        twyneId,
        mediaType,
        promptTitle
    }) {
        this.created = new Date();
        this.order = order;
        this.storyName = storyName;
        this.prompt = prompt;
        this.twyneId = twyneId ?? null;
        this.mediaType = mediaType;
        this.promptTitle = promptTitle;
    }

    static get collectionName() {
        return 'prompts'; // Name of the collection in the database
    }

    static async create(data) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const result = await collection.insertOne(data);
            // Construct the new object with the insertedId
            return new Prompts({ ...data, _id: result.insertedId });
        } catch (error) {
            console.error("Error in Prompts.create:", error);
            throw error;
        }
    }

    static async findByStorylineId(storylineId) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const prompts = await collection.find({ storylineId }).toArray();
            return prompts;
        } catch (error) {
            console.error("Error in Prompts.findByStorylineId:", error);
            throw error;
        }
    }
}

export default Prompts;


