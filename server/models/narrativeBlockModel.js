import { connect } from '../db/db.js'; // Use your database connection setup
import { ObjectId } from 'mongodb';

class NarrativeBlock {
    constructor({
        _id,
        name,
        type,
        durationRange,
        description,
        clipPace
    }) {
        this._id = ObjectId.isValid(_id) ? new ObjectId(_id) : new ObjectId();
        this.name = name;
        this.type = type;
        this.durationRange = durationRange;
        this.description = description;
        this.clipPace = {
            type: clipPace.type,
            quantity: clipPace.quantity,
            bpm: clipPace.bpm,
            interval: clipPace.interval
        };
    }

    static collectionName = 'narrativeBlocks'; // Define the collection name used in MongoDB

    static async insertOne(data) {
        try {
            const db = await connect();
            const collection = db.collection(NarrativeBlock.collectionName);
            const result = await collection.insertOne(new NarrativeBlock(data));
            return result; // Return the inserted document
        } catch (error) {
            console.error('Error in insertOne:', error);
            throw error;
        }
    }

    static async findByType(type) {
        try {
            const db = await connect();
            const collection = db.collection(NarrativeBlock.collectionName);
            return await collection.find({ type }).toArray();
        } catch (error) {
            console.error('Error in findByType:', error);
            throw error;
        }
    }

    static async list() {
        try {
            const db = await connect();
            const collection = db.collection(NarrativeBlock.collectionName);
            return await collection.find().toArray();
        } catch (error) {
            console.error('Error in list:', error);
            throw error;
        }
    }

    static async listShort() {
        try {
            const db = await connect();
            const collection = db.collection(NarrativeBlock.collectionName);
            // Fetching only the 'name' and 'description' fields from each document
            const projection = { _id: 0, name: 1, description: 1 };
            const items = await collection.find({}, { projection }).toArray();
            
            // Processing the result to extract 'name' and 'description'
            const processedItems = items.map(item => ({
                name: item.name,
                description: item.description
            }));
            
            // Minimizing empty spaces between JSON entities
            return JSON.stringify(processedItems);
        } catch (error) {
            console.error('Error in listShort:', error);
            throw error;
        }
    }

    static async findOne(query) {
        try {
            const db = await connect();
            const collection = db.collection(NarrativeBlock.collectionName);
            const narrativeBlock = await collection.findOne(query);
            return narrativeBlock;
        } catch (error) {
            console.error('Error in findOne:', error);
            throw error;
        }
    }
}

export default NarrativeBlock;