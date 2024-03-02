import { connect } from '../db/db.js'; // Adjust with your actual connection file path
import { ObjectId } from 'mongodb';

class Prompts {
    constructor({
        _id = new ObjectId(),
        order,
        storyId,
        prompt,
        momentId,
        mediaType,
        promptTitle,
        collected,
        primers,
        userId,
        contributors = [],
    }) {
        this._id = _id;
        this.created = new Date();
        this.order = order;
        this.storyId = new ObjectId(storyId);
        this.prompt = prompt;
        this.momentId = momentId ?? null;
        this.mediaType = mediaType;
        this.promptTitle = promptTitle;
        this.collected = collected ?? false;
        this.primers = primers ?? [];
        this.userId = userId;
        this.contributors = contributors.map(id => new ObjectId(id));
    }

    static get collectionName() {
        return 'prompts'; // Name of the collection in the database
    }

    static async findByIdFlex(id, fields) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            
            // Default fields to return
            let projection = { _id: 1, storylineId: 1, storylineName: 1 };
            
            // Add optional fields if specified
            if (typeof fields === 'string') {
                fields.split(',').forEach(field => {
                    projection[field] = 1; // Add field to projection
                });
            } else if (typeof fields === 'object') {
                projection = { ...projection, ...fields };
            }
    
            // Check if id is a valid ObjectId before converting
            if (!ObjectId.isValid(id)) {
                throw new Error('Invalid ObjectId format');
            }
    
            // Find the document with the given ID and specified fields
            const prompt = await collection.findOne({ _id: new ObjectId(id) }, { projection });
    
            return prompt;
        } catch (error) {
            console.error('Error in Prompts.findById:', error);
            throw error;
        }
    }

    static async findByStorylineIdFlex(storylineId, fields) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            
            // Default fields to return
            let projection = { _id: 1, storylineId: 1, storylineName: 1 };
            
            // Add optional fields if specified
            if (typeof fields === 'string') {
                fields.split(',').forEach(field => {
                    projection[field.trim()] = 1; // Add field to projection
                });
            } else if (typeof fields === 'object') {
                projection = { ...projection, ...fields };
            }
    
            // Construct query object based on expected type of storylineId
            let query = {};
            if (ObjectId.isValid(storylineId)) {
                query.storylineId = new ObjectId(storylineId);
            } else {
                query.storylineId = storylineId; // Assuming storylineId is a string
            }
    
            // Find documents with the given storylineId and specified fields
            const prompts = await collection.find(query, { projection }).toArray();
    
            return prompts;
        } catch (error) {
            console.error('Error in Prompts.findByStorylineIdFlex:', error);
            throw error;
        }
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

    static async saveMomentToPrompt(promptId, momentId) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
    
            // Update the momentId in the document with the given promptId
            const updateResult = await collection.updateOne(
                { _id: new ObjectId(promptId) },
                { $set: { momentId: momentId } }
            );
    
            return updateResult;
        } catch (error) {
            console.error('Error in saveMomentToPrompt:', error);
            throw error;
        }
    }

    static async getPrimersFromPrompts(storyId) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const primers = await collection.distinct('primers', { storyId });
            return primers;
        } catch (error) {
            console.error('Error in getPrimersFromPrompts:', error);
            throw error;
        }
    }
    static async findAll() {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const prompts = await collection.find({}).toArray();
            return prompts;
        } catch (error) {
            console.error("Error in Prompts.findAll:", error);
            throw error;
        }
    }


    // I want a method that finds all prompts that match the userId
    static async findByUserId(userId) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const prompts = await collection.find({ userId: new ObjectId(userId) }).toArray();
            return prompts;
        } catch (error) {
            console.error("Error in Prompts.findByUserId:", error);
            throw error;
        }
    }

    static async deleteByPromptId(promptId, userId) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
    
            // Find the prompt first to check the owner
            const prompt = await collection.findOne({ _id: new ObjectId(promptId) });
            console.log('prompt:', prompt);
            if (!prompt) {
                throw new Error('Prompt not found');
            }
    
            // Check if the userId of the prompt matches the authenticated user's id
            if (prompt.userId.toString() !== userId.toString()) {
                console.log('prompt.userId:', prompt.userId);
                throw new Error('User is not authorized to delete this prompt');
            }
    
            // If the user is authorized, delete the prompt
            const result = await collection.deleteOne({ _id: new ObjectId(promptId) });
            return result;
        } catch (error) {
            console.error("Error in Prompts.deleteByPromptId:", error);
            throw error;
        }
    }

    static async updateByPromptId(promptId, userId, data) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
    
            // Find the prompt first to check the owner
            const prompt = await collection.findOne({ _id: new ObjectId(promptId) });
            console.log('prompt:', prompt);
            if (!prompt) {
                throw new Error('Prompt not found');
            }
    
            // Check if the userId of the prompt matches the authenticated user's id
            if (prompt.userId.toString() !== userId.toString()) {
                console.log('prompt.userId:', prompt.userId);
                throw new Error('User is not authorized to update this prompt');
            }
    
            // If the user is authorized, update the prompt
            const result = await collection.updateOne({ _id: new ObjectId(promptId) }, { $set: data });
            return result;
        } catch (error) {
            console.error("Error in Prompts.updateByPromptId:", error);
            throw error;
        }
    }

    static async assignContributorsByPromptId(promptId, userId, contributors) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
    
            // Find the prompt first to check the owner
            const prompt = await collection.findOne({ _id: new ObjectId(promptId) });
            console.log('prompt:', prompt);
            if (!prompt) {
                throw new Error('Prompt not found');
            }
    
            // Check if the userId of the prompt matches the authenticated user's id
            if (prompt.userId.toString() !== userId.toString()) {
                console.log('prompt.userId:', prompt.userId);
                throw new Error('User is not authorized to update this prompt');
            }
    
            // If the user is authorized, update the prompt
            const result = await collection.updateOne(
                { _id: new ObjectId(promptId) }, 
                { 
                    $addToSet: { contributors: { $each: contributors.map(id => new ObjectId(id)) } } 
                }
            );
            return result;
        } catch (error) {
            console.error("Error in Prompts.assignContributorsByPromptId:", error);
            throw error;
        }
    }


    

}

export default Prompts;


