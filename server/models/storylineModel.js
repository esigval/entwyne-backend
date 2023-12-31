// storyline.js
import { connect } from '../db/db.js'; // Adjust with your actual connection file path

let db;

class Storyline {
    constructor({ threadId, created, storyName, storyline }) {
        this.threadId = threadId;
        this.created = created || new Date(); // Default to current date if not provided
        this.storyName = storyName;
        this.storyline = storyline || []; // Default to empty array if not provided
    }

    static get collectionName() {
        return 'storylines'; // Name of the collection in the database
    }

    static async create(data) {
        try {
            const db = await connect();
            const collection = db.collection(Storyline.collectionName);
            const result = await collection.insertOne(data);
            // Construct the new object with the insertedId
            return new Storyline({ ...data, _id: result.insertedId });
        } catch (error) {
            console.error("Error in Storyline.create:", error);
            throw error;
        }
    }
    

    // Example update method (you can expand it based on your requirements)
    static async update(id, updateData) {
        if (!db) {
            db = await connect();
        }
        const collection = db.collection(Storyline.collectionName);
        const result = await collection.updateOne({ _id: id }, { $set: updateData });
        return result;
    }

    // Additional methods for delete, find, etc., can be added here
}

export default Storyline;