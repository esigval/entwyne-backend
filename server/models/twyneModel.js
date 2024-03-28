import { connect } from '../db/db.js';
import { ObjectId } from 'mongodb';

class Twyne {
    constructor({
        _id = new ObjectId(),
        name,
        storyId,
        prompts = [],
        userId,
        coCreators = [],
        contributors = [],
        storyline,
        edit,
        storylineTemplate, // Added this line
        progress,
        twyneThumbnail,
        createdAt = new Date(),
        lastUpdated = new Date()

    }) {
        this._id = new ObjectId(_id);
        this.name = name;
        this.storyId = storyId ? new ObjectId(storyId) : null;
        this.prompts = prompts.length ? prompts.map(prompt => new ObjectId(prompt)) : [];
        this.userId = userId ? new ObjectId(userId) : null;
        this.coCreators = coCreators.length ? coCreators.map(coCreator => new ObjectId(coCreator)) : [];
        this.contributors = contributors.length ? contributors.map(contributor => new ObjectId(contributor)) : [];
        this.storyline = storyline ? new ObjectId(storyline) : null;
        this.edit = edit ? new ObjectId(edit) : null;
        this.storylineTemplate = storylineTemplate ? new ObjectId(storylineTemplate) : null;
        this.progress = progress;
        this.twyneThumbnail = twyneThumbnail;
        this.createdAt = createdAt ? new Date(createdAt) : new Date();
        this.lastUpdated = lastUpdated ? new Date(lastUpdated) : new Date();
    }

    hasEdit() {
        return this.edit !== null;
      }

    static get collectionName() {
        return 'twynes'; // Name of the collection in the database
    }

    static async create(data) {
        try {
            const twyne = new Twyne(data);
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const result = await collection.insertOne(twyne);
            // Use the insertedId to construct the new object
            return result;
        } catch (error) {
            console.error("Error in Twyne.create:", error);
            throw error;
        }
    }

    static async deleteTwyne(id) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const result = await collection.deleteOne({ _id: new ObjectId(id) });
            return result.deletedCount;
        } catch (error) {
            console.error("Error in Twyne.deleteTwyne:", error);
            throw error;
        }
    }

    static async findById(id) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const document = await collection.findOne({ _id: new ObjectId(id) });
            return document ? new Twyne(document) : null;
        } catch (error) {
            console.error("Error in Twyne.findById:", error);
            throw error;
        }
    }

    static async findByStoryId(storyId) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const documents = await collection.find({ storyId: new ObjectId(storyId) }).toArray();
            return documents.map(document => new Twyne(document));
        } catch (error) {
            console.error("Error in Twyne.findByStoryId:", error);
            throw error;
        }
    }

    static async update(id, updateData) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const updateDataWithLastUpdated = { ...updateData, lastUpdated: new Date() };
            const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateDataWithLastUpdated });
            return result;
        } catch (error) {
            console.error("Error in Twyne.update:", error);
            throw error;
        }
    }

    static async addNewCoCreator(twyneId, userId) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const result = await collection.updateOne({ _id: new ObjectId(twyneId) }, { $push: { coCreators: new ObjectId(userId) }, $set: { lastUpdated: new Date() } });
            return result;
        } catch (error) {
            console.error("Error in Twyne.addNewCoCreator:", error);
            throw error;
        }
    }   

    static async addNewContributor(twyneId, userId) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const result = await collection.updateOne({ _id: new ObjectId(twyneId) }, { $push: { contributors: new ObjectId(userId) }, $set: { lastUpdated: new Date() } });
            return result;
        } catch (error) {
            console.error("Error in Twyne.addNewContributor:", error);
            throw error;
        }
    }

    static async findByIdAndUserId(storyId, userId) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const result = await collection.findOne({ _id: new ObjectId(storyId), userId: new ObjectId(userId) });
            if (result) {
                return new Twyne(result);
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in Twyne.findByIdAndUserId:", error);
            throw error;
        }
    }

    static async findByIdAndCoCreatorId(storyId, coCreatorId) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const result = await collection.findOne({ _id: new ObjectId(storyId), coCreators: new ObjectId(coCreatorId) });
            if (result) {
                return new Twyne(result);
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in Twyne.findByIdAndCoCreatorId:", error);
            throw error;
        }
    }
    
    static async findByIdAndContributorId(storyId, contributorId) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const result = await collection.findOne({ _id: new ObjectId(storyId), contributors: new ObjectId(contributorId) });
            if (result) {
                return new Twyne(result);
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in Twyne.findByIdAndContributorId:", error);
            throw error;
        }
    }

    static async listByStoryId(storyId) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const cursor = collection.find({ storyId: new ObjectId(storyId) });
            const documents = await cursor.toArray();
            return documents.map(document => new Twyne(document));
        } catch (error) {
            console.error("Error in Twyne.listByStoryId:", error);
            throw error;
        }
    }

    static async listContributors(id) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const result = await collection.findOne({ _id: new ObjectId(id) });
            return result.contributors;
        } catch (error) {
            console.error("Error in Twyne.listContributors:", error);
            throw error;
        }
    }

    static async listCoCreators(id) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const result = await collection.findOne({ _id: new ObjectId(id) });
            return result.coCreators;
        } catch (error) {
            console.error("Error in Twyne.listCoCreators:", error);
            throw error;
        }
    }

    static async calculateStoryProgressFunction(storyId) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const storyObjectId = new ObjectId(storyId);
            const twynesCursor = collection.find({ storyId: storyObjectId });
            const twynes = await twynesCursor.toArray();

            const totalTwynes = twynes.length;
            let editsCount = 0;

            twynes.forEach(twyne => {
                if (twyne.edit) editsCount++;
            });

            const ratio = totalTwynes > 0 ? editsCount / totalTwynes : 0;
            console.log(`Ratio of Twynes with edits to total Twynes is: ${ratio.toFixed(2)}`);
            return ratio;
        } catch (error) {
            console.error('Error calculating story function:', error);
            throw error; // Rethrow or handle as needed
        }
    }

    static async calculateTwyneProgressFunction(twyneId) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const twyneObjectId = new ObjectId(twyneId);
            const twyne = await collection.findOne({ _id: twyneObjectId });

            const totalPrompts = twyne.prompts.length;
            let filledPromptsCount = 0;

            twyne.prompts.forEach(prompt => {
                if (prompt.filled) filledPromptsCount++;
            });

            const ratio = totalPrompts > 0 ? filledPromptsCount / totalPrompts : 0;
            console.log(`Ratio of filled prompts to total prompts is: ${ratio.toFixed(2)}`);
            return ratio;
        } catch (error) {
            console.error('Error calculating prompt function:', error);
            throw error; // Rethrow or handle as needed
        }
    }
}

export default Twyne;