import { connect } from '../db/db.js';
import { ObjectId } from 'mongodb';

class Twyne {
    constructor({
        _id = new ObjectId(),
        prompts = [],
        owner,
        coCreators = [],
        contributors = [],
        storyline,
        edit,
        storylineTemplate, // Added this line
    }) {
        this._id = _id;
        this.prompts = prompts.map(prompt => new ObjectId(prompt));
        this.owner = new ObjectId(owner);
        this.coCreators = coCreators.map(coCreator => new ObjectId(coCreator));
        this.contributors = contributors.map(contributor => new ObjectId(contributor));
        this.storyline = new ObjectId(storyline);
        this.edit = new ObjectId(edit);
        this.storylineTemplate = new ObjectId(storylineTemplate); // Added this line
    }


    static get collectionName() {
        return 'twynes'; // Name of the collection in the database
    }

    static async create(data) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const result = await collection.insertOne(data);
            // Use the insertedId to construct the new object
            return new Twyne({ ...data, _id: result.insertedId });
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

    static async update(id, updateData) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const result = await collection.updateOne({ _id: new ObjectId(id) }, { $set: updateData });
            return result;
        } catch (error) {
            console.error("Error in Twyne.update:", error);
            throw error;
        }fr
    }

    static async findByIdAndUserId(storyId, userId) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const result = await collection.findOne({ _id: new ObjectId(storyId), owner: new ObjectId(userId) });
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
}

export default Twyne;