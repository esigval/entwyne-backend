import { connect } from '../db/db.js'; // Adjust with your actual connection file path
import { ObjectId } from 'mongodb';

class Prompts {
    constructor({
        order,
        storyName,
        prompt,
        twyneId,
        mediaType,
        promptTitle,
        collected,
    }) {
        this.created = new Date();
        this.order = order;
        this.storyName = storyName;
        this.prompt = prompt;
        this.twyneId = twyneId ?? null;
        this.mediaType = mediaType;
        this.promptTitle = promptTitle;
        this.collected = collected ?? false;
    }

    static get collectionName() {
        return 'prompts'; // Name of the collection in the database
    }

    static async create(data) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            data.created = new Date();
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

    static async findByStorylineIdAndMediaType(storylineId, mediaType) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const prompts = await collection.find({ storylineId, mediaType }).toArray();
            return prompts;
        } catch (error) {
            console.error("Error in Prompts.findByStorylineIdAndMediaType:", error);
            throw error;
        }
    }

    static async checkByStoryIdAndMediaType(storyId, mediaType) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const count = await collection.countDocuments({ storyId, mediaType });
            return count > 0;
        } catch (error) {
            console.error("Error in Prompts.findByStoryIdAndMediaType:", error);
            throw error;
        }
    }

    static async findByStoryIdAndMediaType(storyId, mediaType) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const prompts = await collection.find({ storyId, mediaType, collected: { $ne: true } }).toArray();
            return prompts;
        } catch (error) {
            console.error("Error in Prompts.findByStoryIdAndMediaType:", error);
            throw error;
        }
    }
    

    static async findByStorylineIdWithTranscription(storylineId) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const prompts = await collection.find({ storylineId, transcription: { $ne: null } }).toArray();
            return prompts;
        } catch (error) {
            console.error("Error in Prompts.findByStorylineIdWithTranscription:", error);
            throw error;
        }
    }

    static async findByStorylineIdWithThumbnail(storylineId) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const prompts = await collection.find({ storylineId, thumbnailUrl: { $ne: null } }).toArray();
            return prompts;
        } catch (error) {
            console.error("Error in Prompts.findByStorylineIdWithThumbnail:", error);
            throw error;
        }
    }

    static async setCollectedtoTrue(promptId) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const result = await collection.updateOne({ _id: new ObjectId(promptId) }, { $set: { collected: true } });
            return result;
        } catch (error) {
            console.error("Error in Prompts.setCollectedtoTrue:", error);
            throw error;
        }
    }

    static async checkPromptsCollected(storylineId) {
        try {
            // we'll want to check if all prompts for the given storylineId that match mediaType "video" have been collected
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const query = { 
                storylineId, 
                mediaType: "video", 
                $or: [
                    { collected: false },
                    { collected: { $exists: false } }
                ] 
            };
            const uncollectedPrompt = await collection.findOne(query);
            return uncollectedPrompt === null;
        } catch (error) {
            console.error('Error in checkPromptsCollected:', error);
            throw error;
        }
    }

    static async getStorylineId(promptId) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const result = await collection.findOne({ _id: new ObjectId(promptId) });
            return result.storylineId;
        } catch (error) {
            console.error('Error in getStorylineId:', error);
            throw error;
        }
    }

    static async saveTwyneToPrompt(promptId, twyneId) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
    
            // Update the twyneId in the document with the given promptId
            const updateResult = await collection.updateOne(
                { _id: new ObjectId(promptId) },
                { $set: { twyneId: twyneId } }
            );
    
            return updateResult;
        } catch (error) {
            console.error('Error in saveTwyneToPrompt:', error);
            throw error;
        }
    }


    // I want to find prompts that match the storyId exist 

}

export default Prompts;


