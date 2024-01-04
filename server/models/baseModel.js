import { connect } from '../db/db.js';
import { ObjectId } from 'mongodb';

export default class BaseModel {
    constructor(collectionName) {
        this.collectionName = collectionName;
    }

    async create(data) {
        try {
            const db = await connect();
            const collection = db.collection(this.collectionName);
            const result = await collection.insertOne(data);
            return { ...data, _id: result.insertedId };
        } catch (error) {
            console.error(`Error in ${this.collectionName}.create:`, error);
            throw error;
        }
    }

    async update(id, updateData) {
        const db = await connect();
        const collection = db.collection(this.collectionName);
        const result = await collection.updateOne({ _id: id }, { $set: updateData });
        return result;
    }

    async deleteOne(id) {
        try {
            const db = await connect();
            const collection = db.collection(this.collectionName);
            const result = await collection.deleteOne({ _id: id });
            return result;
        } catch (error) {
            console.error(`Error in ${this.collectionName}.delete:`, error);
            throw error;
        }
    }

    async findById(id) {
        if (!ObjectId.isValid(id)) {
            throw new Error(`Invalid ObjectId string: ${id}`);
        }
        const db = await connect();
        const collection = db.collection(this.collectionName);
        const result = await collection.findOne({ _id: new ObjectId(id) });
        return result ? result : null;
    }
}