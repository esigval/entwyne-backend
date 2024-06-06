import { connect } from '../db/db.js'; // Adjust with your actual connection file path
import { ObjectId } from 'mongodb';

class Prompts {
    constructor({
        _id = ObjectId.isValid(_id) ? _id : new ObjectId(),
        order,
        storyId,
        prompt,
        momentId = [],
        mediaType,
        promptTitle,
        collected,
        progress,
        primers,
        userId,
        twyneId,
        storylineId,
        contributors = [],
        createdAt = new Date(), // Default to current time if not provided
        lastUpdated = new Date(), // Default to current time if not provided
    }) {
        const objectId = _id ? (ObjectId.isValid(_id) ? new ObjectId(_id) : new ObjectId()) : new ObjectId();
        this._id = objectId
        this.createdAt = createdAt; // Set using passed value or default
        this.lastUpdated = lastUpdated; // Set using passed value or default
        this.order = order;
        this.storyId = new ObjectId(storyId);
        this.prompt = prompt;
        this.momentId = momentId.map(id => ObjectId.isValid(id) ? id : new ObjectId(id));
        this.mediaType = mediaType;
        this.promptTitle = promptTitle;
        this.collected = String(collected);
        this.progress = progress;
        this.primers = primers ?? [];
        this.userId = ObjectId.isValid(userId) ? new ObjectId(userId) : userId;
        this.twyneId = ObjectId.isValid(twyneId) ? new ObjectId(twyneId) : twyneId;
        this.storylineId = ObjectId.isValid(storylineId) ? new ObjectId(storylineId) : storylineId;
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

    static async findById(id) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const prompt = await collection.findOne({ _id: new ObjectId(id) });
            return prompt;
        } catch (error) {
            console.error('Error in Prompts.findById:', error);
            throw error;
        }
    }

static async linkStorylineIdtoPrompts(storylineId, promptIds) {
    const db = await connect();
    const collection = db.collection('prompts'); // Adjust with your actual collection name

    const storylineObjectId = ObjectId.isValid(storylineId) ? new ObjectId(storylineId) : storylineId;
    const promptObjectIds = Array.isArray(promptIds) ? promptIds.map(id => ObjectId.isValid(id) ? new ObjectId(id) : id) : [promptIds];

    await collection.updateMany(
        { _id: { $in: promptObjectIds } },
        { $set: { storylineId: storylineObjectId } }
    );
}

    static async insertMany(prompts) {
        try {
            const db = await connect(); // Make sure this properly connects to your MongoDB
            const collection = db.collection(Prompts.collectionName);

            // Assuming Prompts' properties are directly compatible with your MongoDB schema:
            const result = await collection.insertMany(prompts);
            console.log("Inserted prompts count:", result.insertedCount);

            // Return an array of the inserted IDs
            const insertedIds = Object.values(result.insertedIds);
            return insertedIds;
        } catch (error) {
            console.error('Error in Prompts.insertMany:', error);
            throw error;
        }
    }

    static async findMomentIdByPromptId(promptId) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const prompt = await collection.findOne({ _id: new ObjectId(promptId) });
            return prompt.momentId;
        } catch (error) {
            console.error('Error in findMomentIdByPromptId:', error);
            throw error;
        }
    }
    static async findMomentIdsByPromptIds(promptIds) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const prompts = await collection.find({ _id: { $in: promptIds.map(id => new ObjectId(id)) } }).toArray();
            return prompts.map(prompt => prompt.momentId);
        } catch (error) {
            console.error('Error in findMomentIdsByPromptIds:', error);
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
            // Map the contributors to ObjectId instances
            if (data.contributors && Array.isArray(data.contributors)) {
                data.contributors = data.contributors.map(contributor => new ObjectId(contributor));
            }
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
    static async setCollectedStatus(promptId, status) {
        try {
            console.log('promptId:', promptId);
            console.log('status:', status);
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const result = await collection.updateOne(
                { _id: new ObjectId(promptId) },
                { $set: { collected: status, lastUpdated: new Date() } }
            );
            return result;
        } catch (error) {
            console.error("Error in Prompts.setCollectedStatus:", error);
            throw error;
        }
    }

    static async setProgress(promptId, progress) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const result = await collection.updateOne(
                { _id: new ObjectId(promptId) },
                { $set: { progress, lastUpdated: new Date() } }
            );
            return result;
        } catch (error) {
            console.error("Error in Prompts.setProgress:", error);
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

            // Convert momentId and promptId to an ObjectId
            momentId = new ObjectId(momentId);
            promptId = new ObjectId(promptId);

            // Update the momentId and lastUpdated in the document with the given promptId
            const updateResult = await collection.updateOne(
                { _id: promptId },
                { $push: { momentId: momentId }, $set: { lastUpdated: new Date() } }
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


    static async findByUserId(userId) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const prompts = await collection.find({
                $or: [
                    { userId: new ObjectId(userId) },
                    { contributors: new ObjectId(userId) }
                ]
            }).toArray();
    
            // Remove duplicates
            const uniquePrompts = Array.from(new Set(prompts.map(prompt => JSON.stringify(prompt)))).map(prompt => JSON.parse(prompt));
    
            return uniquePrompts;
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

    static async deleteByPromptIdSystem(promptId) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);

            // Find the prompt first to check if it exists
            const prompt = await collection.findOne({ _id: new ObjectId(promptId) });
            console.log('prompt:', prompt);
            if (!prompt) {
                throw new Error('Prompt not found');
            }

            // If the prompt exists, delete it
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
            const updatedData = { ...data, lastUpdated: new Date() };
            const result = await collection.updateOne({ _id: new ObjectId(promptId) }, { $set: updatedData });
            return result;
        } catch (error) {
            console.error("Error in Prompts.updateByPromptId:", error);
            throw error;
        }
    }

    static async assignContributorsByPromptId(promptId, userId, contributors) {
        console.log('promptId:', promptId);
        console.log('userId:', userId);
        console.log('contributors:', contributors);
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
                    $addToSet: { contributors: { $each: contributors.map(id => new ObjectId(id)) } },
                    $set: { lastUpdated: new Date() }
                }
            );
            return result;
        } catch (error) {
            console.error("Error in Prompts.assignContributorsByPromptId:", error);
            throw error;
        }
    }

    static async findUserIdByPromptId(promptId) {
        console.log('promptId:', promptId);
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const prompt = await collection.findOne({ _id: new ObjectId(promptId) });
            if (!prompt) {
                throw new Error('No prompt found with the provided ID');
            }
            return prompt.userId;
        } catch (error) {
            console.error('Error in findUserIdByPromptId:', error);
            throw error;
        }
    }

    static async getPromptCollectedStatus(promptId) {
        try {
            const db = await connect();
            const collection = db.collection(Prompts.collectionName);
            const promptObjectId = new ObjectId(promptId);
            const prompt = await collection.findOne({ _id: promptObjectId });
            return prompt.collected;
        } catch (error) {
            console.error('Error getting prompt collected status:', error);
            throw error; // Rethrow or handle as needed
        }
    }

    static async findByContributorId(userId) {
        const db = await connect();
        const prompts = await db.collection('prompts').find({ contributors: userId }).toArray();
        if (!prompts.length) {
            throw new Error('No prompts found for the user');
        }
        return prompts;
    }




}

export default Prompts;


