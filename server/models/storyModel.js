// storyline.js
import { connect } from '../db/db.js'; // Adjust with your actual connection file path
import { ObjectId } from 'mongodb';


class Story {
    constructor({ threadId, created, storyName, storyline }) {
        this.threadId = threadId;
        this.created = created || new Date(); // Default to current date if not provided
        this.storyName = storyName;
        this.storyline = storyline || []; // Default to empty array if not provided
    }

    static get collectionName() {
        return 'stories'; // Name of the collection in the database
    }

    static async create(data) {
        try {
            const db = await connect();
            const collection = db.collection(Story.collectionName);
            const result = await collection.insertOne(data);
            return new Story({ ...data, _id: result.insertedId });
        } catch (error) {
            console.error("Error in Storyline.create:", error);
            throw error;
        }
    }
    
    static async update(id, updateData) {
        try {
            const db = await connect();
            const collection = db.collection(Story.collectionName);
            const result = await collection.updateOne({ _id: id }, { $set: updateData });
            return result;
        } catch (error) {
            console.error("Error in Storyline.update:", error);
            throw error;
        }
    }
    
    static async deleteOne(id) {
        try {
            const db = await connect();
            const collection = db.collection(Story.collectionName);
            const result = await collection.deleteOne({ _id: id });
            return result;
        } catch (error) {
            console.error("Error in Storyline.delete:", error);
            throw error;
        }
    }
    
    static async findById(id) {
        try {
            if (!ObjectId.isValid(id)) {
                throw new Error(`Invalid ObjectId string: ${id}`);
            }
            const db = await connect();
            const collection = db.collection(Story.collectionName);
            const result = await collection.findOne({ _id: new ObjectId(id) });
            if (result) {
                return new Story(result);
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in Storyline.findById:", error);
            throw error;
        }
    }

    

    // Additional methods for delete, find, etc., can be added here
}

export default Story;