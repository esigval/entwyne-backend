// storyline.js
import { connect } from '../db/db.js'; // Adjust with your actual connection file path
import { ObjectId } from 'mongodb';


class Story {
    constructor({ _id, threadId, createdAt = new Date(), storyName, storyline, twyneId, userId, progress, coCreators = [], thumbnail, lastUpdated = new Date() }) {
        this._id = _id ? new ObjectId(_id) : new ObjectId();
        this.threadId = threadId;
        this.createdAt = createdAt || new Date(); // Default to current date if not provided
        this.storyName = storyName;
        this.storyline = storyline || []; // Default to empty array if not provided
        this.userId = userId;
        this.twyneId = Array.isArray(twyneId) ? twyneId.map(id => ObjectId(id)) : [];
        this.progress = progress || .75; // Default to .75 if not provided.
        this.coCreators = coCreators.map(id => new ObjectId(id)); // Ensure coCreators are ObjectIds || [];
        this.storyThumbnail = thumbnail || null; // Default to null if not provided
        this.lastUpdated = lastUpdated || new Date(); // Default to current date if not provided

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

    static async update(id, updateOperation) {
        try {
            const db = await connect();
            const collection = db.collection(Story.collectionName);
    
            // Ensure id is an ObjectId
            if (typeof id === 'string') {
                if (!ObjectId.isValid(id)) {
                    console.error("Invalid id:", id);
                    throw new Error("Invalid id");
                }
                id = new ObjectId(id);
            }
    
            // Add lastUpdated field to updateOperation
            if (!updateOperation.$set) {
                updateOperation.$set = {};
            }
            updateOperation.$set.lastUpdated = new Date();
    
            const result = await collection.updateOne({ _id: id }, updateOperation);
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