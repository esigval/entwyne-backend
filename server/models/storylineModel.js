import { connect } from '../db/db.js';
import { ObjectId } from 'mongodb';

class Storyline {
    constructor({
        _id = new ObjectId(),
        name,
        theme,
        totalTargetDuration,
        structure = [],
        soundRules,
        createdAt = new Date(),
        lastUpdated = new Date(),
    }) {
        this._id = ObjectId.isValid(_id) ? new ObjectId(_id) : new ObjectId();
        this.name = name;
        this.theme = theme;
        this.totalTargetDuration = totalTargetDuration;
        this.structure = structure.map(({ part, type, order, durationRange, suggestedDuration, sceneInstructions, blockInstructions, clipPace, clips = [] }) => ({
            part,
            type,
            order: Number(order),
            durationRange: {
                min: Number(durationRange.min),
                max: Number(durationRange.max),
            },
            suggestedDuration: Number(suggestedDuration),
            blockInstructions,
            sceneInstructions,
            clipPace: {
                type: clipPace.type,
                bpm: clipPace.bpm ? Number(clipPace.bpm) : null,
                interval: clipPace.interval ? Number(clipPace.interval) : null,
            },
            clips: clips.map(({ prompt, length, type, promptId, id }) => ({
                id: id ? id : new ObjectId().toString(), // Generate a new ObjectId or use the existing one
                prompt,
                length,
                type,
                promptId
            })),
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