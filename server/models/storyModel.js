// storyline.js
import { connect } from '../db/db.js'; // Adjust with your actual connection file path
import { ObjectId } from 'mongodb';


class Story {
    constructor({ _id, createdAt = new Date(), storyName, storyline, twyneId, threadId, storySummary, userId, coCreators = [], thumbnail, lastUpdated = new Date(), defaultVideoSettings = { orientation: 'landscape', quality: 'high' }, defaultNarrative }) {
        this._id = _id ? new ObjectId(_id) : new ObjectId();
        this.threadId = threadId;
        this.createdAt = createdAt || new Date(); // Default to current date if not provided
        this.storyName = storyName;
        this.storyline = storyline || []; // Default to empty array if not provided
        this.userId = userId;
        this.twyneId = Array.isArray(twyneId) ? twyneId.map(id => ObjectId(id)) : [];
        this.threadId = threadId;
        this.storySummary = storySummary || null; // Default to null if not provided
        this.coCreators = coCreators.map(id => new ObjectId(id)); // Ensure coCreators are ObjectIds || [];
        this.storyThumbnail = thumbnail || null; // Default to null if not provided
        this.lastUpdated = lastUpdated || new Date(); // Default to current date if not provided
        this.defaultVideoSettings = defaultVideoSettings || { orientation: 'vertical', quality: 'high' };
        this.defaultNarrative = defaultNarrative || null; // Default to null if not provided
    }


    static get collectionName() {
        return 'stories'; // Name of the collection in the database
    }

    static async findByIdAndUserId(storyId, userId) {
        try {
            if (!ObjectId.isValid(storyId)) {
                throw new Error(`Invalid ObjectId string: ${storyId}`);
            }
            if (!ObjectId.isValid(userId)) {
                throw new Error(`Invalid ObjectId string: ${userId}`);
            }

            // Convert to ObjectId if necessary
            storyId = storyId instanceof ObjectId ? storyId : new ObjectId(storyId);
            userId = userId instanceof ObjectId ? userId : new ObjectId(userId);

            console.log("storyId", storyId);
            console.log("userId", userId);
            const db = await connect();
            const collection = db.collection(Story.collectionName);
            const result = await collection.findOne({ _id: storyId, userId: userId });
            if (result) {
                return new Story(result);
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in Story.findByIdAndUserId:", error);
            throw error;
        }
    }

    static async findByUserId(userId) {
        try {
            const db = await connect();
            const collection = db.collection(Story.collectionName);

            // Ensure userId is an ObjectId
            if (typeof userId === 'string') {
                if (!ObjectId.isValid(userId)) {
                    console.error("Invalid userId:", userId);
                    throw new Error("Invalid userId");
                }
                userId = new ObjectId(userId);
            }

            const result = await collection.find({ userId }).toArray();
            return result.map(doc => new Story(doc)); // return an array of Story instances
        } catch (error) {
            console.error("Error in Story.findByUserId:", error);
            throw error;
        }
    }

    static async findByCoCreatorId(userId) {
        try {
            const db = await connect();
            const collection = db.collection(Story.collectionName);
    
            // Ensure userId is an ObjectId
            if (typeof userId === 'string') {
                if (!ObjectId.isValid(userId)) {
                    console.error("Invalid userId:", userId);
                    throw new Error("Invalid userId");
                }
                userId = new ObjectId(userId);
            }
    
            const result = await collection.find({ coCreators: userId }).toArray();
            return result.map(doc => new Story(doc)); // return an array of Story instances
        } catch (error) {
            console.error("Error in Story.findByCoCreatorId:", error);
            throw error;
        }
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
        // Convert specific fields in updateData to ObjectId instances
        const fieldsToConvert = ['storyId', 'userId', 'storyline', 'edit', 'storylineTemplate'];
        const convertedUpdateData = { ...updateData };
        fieldsToConvert.forEach(field => {
            if (convertedUpdateData[field]) {
                convertedUpdateData[field] = new ObjectId(convertedUpdateData[field]);
            }
        });

        // Convert arrays of IDs for prompts, coCreators, contributors to ObjectId instances
        ['prompts', 'coCreators', 'contributors'].forEach(arrayField => {
            if (convertedUpdateData[arrayField] && Array.isArray(convertedUpdateData[arrayField])) {
                convertedUpdateData[arrayField] = convertedUpdateData[arrayField].map(id => new ObjectId(id));
            }
        });

        // Include lastUpdated timestamp in the update
        const updateDataWithLastUpdated = { ...convertedUpdateData, lastUpdated: new Date() };

        const db = await connect();
        const collection = db.collection(Story.collectionName);
        const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateDataWithLastUpdated });
        return result;
    } catch (error) {
        console.error("Error in Story.update:", error);
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

    static async findByThreadId(threadId) {
        try {
            const db = await connect();
            const collection = db.collection(Story.collectionName);
            const result = await collection.findOne({ threadId });
            return result;  // return the raw document
        } catch (error) {
            console.error("Error in Storyline.findByThreadId:", error);
            throw error;
        }
    }

    static async findThreadByStoryId(storyId) { // This is a custom method
        try {
            const story = await Story.findById(storyId); // Pass the storyId directly
            return story.threadId; // Assuming the story model has a 'threadId' field
        } catch (error) {
            console.error('Error finding story:', error);
            throw error;
        }
    }



    // Additional methods for delete, find, etc., can be added here
}

export default Story;