import { connect } from '../db/db.js';
import { ObjectId } from 'mongodb';

class Storyline {
    constructor({
        _id = new ObjectId(),
        twyneId,
        name,
        theme,
        structure = [],
        soundRules,
        createdAt = new Date(),
        lastUpdated = new Date(),
    }) {
        this._id = _id instanceof ObjectId ? _id : new ObjectId(_id);
        this.twyneId = twyneId instanceof ObjectId ? twyneId : new ObjectId(twyneId);
        this.name = name;
        this.theme = theme;
        this.structure = structure.map(({ part, type, order, duration, instructions, shotPace }) => ({
            part,
            type,
            order: Number(order),
            duration: {
                min: Number(duration.min),
                max: Number(duration.max),
            },
            instructions,
            shotPace: {
                type: shotPace.type,
                bpm: shotPace.bpm ? Number(shotPace.bpm) : null,
            },
        }));
        this.soundRules = soundRules;
        this.createdAt = createdAt ? new Date(createdAt) : new Date();
        this.lastUpdated = lastUpdated ? new Date(lastUpdated) : new Date();
    }


    static get collectionName() {
        return 'storylines';
    }

    static async createStorylineInstance(narrativeStyle) {
        try {
            const db = await connect();
            const collection = db.collection(Storyline.collectionName);
            const result = await collection.insertOne(narrativeStyle);
            return result.insertedId;
        } catch (error) {
            console.error("Error in Storyline.createStorylineInstance:", error);
            throw error;
        }
    }   

    static async linkStorylineToTwyne(storylineId, twyneId) {
        try {
            const db = await connect();
            const collection = db.collection(Storyline.collectionName);
            const twyneObjectId = twyneId instanceof ObjectId ? twyneId : new ObjectId(twyneId);
            const result = await collection.updateOne({ _id: new ObjectId(storylineId) }, { $set: { twyneId: twyneObjectId } });
            return result.modifiedCount;
        }
        catch (error) {
            console.error("Error in Storyline.linkStorylineToTwyne:", error);
            throw error;
        }
    }

};

export default Storyline;