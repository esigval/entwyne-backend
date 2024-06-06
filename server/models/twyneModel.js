import { connect } from '../db/db.js';
import { ObjectId } from 'mongodb';
import Prompts from './promptModel.js';

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
        threadId,
        storylineTemplate, // Added this line
        progress,
        twyneThumbnail,
        createdAt = new Date(),
        lastUpdated = new Date(),
        twyneSummary,
        theme,
        currentRender,

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
        this.threadId = threadId;
        this.storylineTemplate = storylineTemplate ? new ObjectId(storylineTemplate) : null;
        this.progress = progress;
        this.twyneThumbnail = twyneThumbnail;
        this.createdAt = createdAt ? new Date(createdAt) : new Date();
        this.lastUpdated = lastUpdated ? new Date(lastUpdated) : new Date();
        this.twyneSummary = twyneSummary;
        this.theme = theme;
        this.currentRender = currentRender;
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

    static async setCurrentRender(twyneId, uri) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const result = await collection.updateOne(
                { _id: new ObjectId(twyneId) },
                { 
                    $set: { currentRender: uri }
                }
            );
            return result;
        } catch (error) {
            console.error("Error in Twyne.setCurrentRender:", error);
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
    
    static async deleteThreadId(twyneId) {
        try { 
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const result = await collection.updateOne({ _id: new ObjectId(twyneId) }, { $set: { threadId: null } });
            return result.modifiedCount;
        } catch (error) {
            console.error("Error in Twyne.deleteThreadId:", error);
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
            // Convert specific fields in updateData to ObjectId instances
            const fieldsToConvert = ['storyId', 'userId', 'storyline', 'edit', 'storylineTemplate'];
            const convertedUpdateData = { ...updateData };
            fieldsToConvert.forEach(field => {
                if (convertedUpdateData[field]) {
                    try {
                        console.log(`Converting ${field} to ObjectId:`, convertedUpdateData[field]);
                        convertedUpdateData[field] = new ObjectId(convertedUpdateData[field]);
                    } catch (e) {
                        console.error(`Error converting ${field} to ObjectId:`, e);
                    }
                }
            });
    
            // Convert arrays of IDs for prompts, coCreators, contributors to ObjectId instances
            ['prompts', 'coCreators', 'contributors'].forEach(arrayField => {
                if (convertedUpdateData[arrayField] && Array.isArray(convertedUpdateData[arrayField])) {
                    convertedUpdateData[arrayField] = convertedUpdateData[arrayField].map(id => {
                        try {
                            console.log(`Converting ${arrayField} element to ObjectId:`, id);
                            return ObjectId.isValid(id) ? new ObjectId(id) : id;
                        } catch (e) {
                            console.error(`Error converting ${arrayField} element to ObjectId:`, e);
                            return id; // Returning the original id if conversion fails
                        }
                    });
                }
            });
    
            // Include lastUpdated timestamp in the update
            const updateDataWithLastUpdated = { ...convertedUpdateData, lastUpdated: new Date() };
    
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const result = await collection.updateOne({ _id: id instanceof ObjectId ? id : new ObjectId(id) }, { $set: updateDataWithLastUpdated });
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
            if (totalPrompts === 0) {
                console.log("No prompts exist.");
                return 0;
            }
    
            let collectedPromptsCount = 0;
    
            for (const promptId of twyne.prompts) {
                const collected = await Prompts.getPromptCollectedStatus(promptId);
                if (collected === "true") collectedPromptsCount++;
            }
    
            const ratio = collectedPromptsCount / totalPrompts;
            const progress = Math.round(ratio * 100);
            console.log(`Progress is: ${progress}`);
    
            await collection.updateOne({ _id: twyneObjectId }, { $set: { progress: progress } });
    
            return progress;
        } catch (error) {
            console.error('Error calculating prompt function:', error);
            throw error; // Rethrow or handle as needed
        }
    }

    static async linkStorylineToTwyne(storylineId, twyneId) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const result = await collection.updateOne({ _id: new ObjectId(twyneId) }, { $set: { storyline: new ObjectId(storylineId) } });
            return result.modifiedCount;
        } catch (error) {
            console.error("Error in Twyne.linkStorylineToTwyne:", error);
            throw error;
        }
    }

    
}

export default Twyne;

