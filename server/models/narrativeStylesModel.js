import { connect } from '../db/db.js';
import { ObjectId } from 'mongodb';

class NarrativeStyle {
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
            clips: clips.map(({ prompt, length, type }) => ({
                prompt,
                length,
                type
            })),
        }));
        this.soundRules = soundRules;
        this.createdAt = createdAt ? new Date(createdAt) : new Date();
        this.lastUpdated = lastUpdated ? new Date(lastUpdated) : new Date();
    }

    static get collectionName() {
        return 'narrativeStyles';
    }

    static async findById(_id) {
        try {
            if (!ObjectId.isValid(_id)) {
                throw new Error(`Invalid ObjectId string: ${_id}`);
            }

            const db = await connect();
            const collection = db.collection(NarrativeStyle.collectionName);
            const result = await collection.findOne({ _id: new ObjectId(_id) });
            if (result) {
                return new NarrativeStyle(result);
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in NarrativeStyle.findById:", error);
            throw error;
        }
    }

    static async findByName(name) {
        try {
            const db = await connect();
            const collection = db.collection(NarrativeStyle.collectionName);
            const result = await collection.findOne({
                name: name,
            });
            if (result) {
                return new NarrativeStyle(result);
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in NarrativeStyle.findByName:", error);
            throw error;
        }
    }

    static async createStorylineInstance(narrativeStyle) {
        try {
            const db = await connect();
            const collection = db.collection(NarrativeStyle.collectionName);
            const result = await collection.insertOne(narrativeStyle);
            return result.insertedId;
        } catch (error) {
            console.error("Error in NarrativeStyle.createStorylineInstance:", error);
            throw error;
        }
    }
}


export default NarrativeStyle;