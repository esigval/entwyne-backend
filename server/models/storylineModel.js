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
        twyneId = new ObjectId(),
        rendered,
        twyneRenderUri,

    }) {
        this._id = ObjectId.isValid(_id) ? new ObjectId(_id) : new ObjectId();
        this.name = name;
        this.theme = theme;
        this.totalTargetDuration = totalTargetDuration;
        this.structure = structure.map(({ part, type, order, durationRange, suggestedDuration, targetedDuration, sceneInstructions, blockInstructions, clipPace, clips = [] }) => ({
            part,
            type,
            order: Number(order),
            durationRange: {
                min: Number(durationRange.min),
                max: Number(durationRange.max),
            },
            suggestedDuration: Number(suggestedDuration),
            targetedDuration,
            blockInstructions,
            sceneInstructions,
            clipPace: {
                type: clipPace.type,
                bpm: clipPace.bpm ? Number(clipPace.bpm) : null,
                quantity: clipPace.quantity ? Number(clipPace.quantity) : null,
                interval: clipPace.interval ? Number(clipPace.interval) : null,
                clipLength: clipPace.clipLength ? Number(clipPace.clipLength) : null,
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
        this.twyneId = twyneId;
        this.rendered = false;
        this.twyneRenderUri = twyneRenderUri;
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

    static async updateTwyneRenderUri(storylineId, newUri) {
        try {
            const db = await connect();
            const collection = db.collection(Storyline.collectionName);
            const result = await collection.updateOne(
                { _id: new ObjectId(storylineId) },
                { $set: { twyneRenderUri: newUri } }
            );
            return result.modifiedCount;
        } catch (error) {
            console.error("Error in Storyline.updateTwyneRenderUri:", error);
            throw error;
        }
    }

    static async updateRenderedStatus(storylineId, newStatus) {
        try {
            const db = await connect();
            const collection = db.collection(Storyline.collectionName);
            const result = await collection.updateOne(
                { _id: new ObjectId(storylineId) },
                { $set: { rendered: newStatus } }
            );
            return result.modifiedCount;
        } catch (error) {
            console.error("Error in Storyline.updateRenderedStatus:", error);
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

    

    static async getStorylineByTwyneId(twyneId) {
        try { 
            const db = await connect();
            const collection = db.collection(Storyline.collectionName);
            const document = await collection.findOne({ twyneId: new ObjectId(twyneId) });
    
            if (document) {
                // Iterate over the structure and get the part, type, and sceneInstructions of each item
                const processedStructure = document.structure.map(({ part, type, sceneInstructions }) => {
                    return {
                        part,
                        type,
                        sceneInstructions: sceneInstructions.replace(/\s+/g, ' ').trim()  // Remove unnecessary spaces
                    };
                });
    
                // Replace the structure in the document with the processed structure
                document.structure = processedStructure;
            }
    
            return document;
        } catch (error) {
            console.error("Error in Storyline.getStorylineByTwyneId:", error);
            throw error;
        }
    }

    static async getTotalClips(storylineId) {
        try {
            const db = await connect();
            const collection = db.collection(Storyline.collectionName);
            const storyline = await collection.findOne({ _id: new ObjectId(storylineId) });
            let totalClips = 0;
            storyline.structure.forEach(part => {
                totalClips += part.clips.length;
            });
            return totalClips;
        } catch (error) {
            console.error("Error in Storyline.getTotalClips:", error);
            throw error;
        }
    }

    static async getStorylineById(storylineId) {
        try {
            const db = await connect();
            const collection = db.collection(Storyline.collectionName);
            return await collection.findOne({ _id: new ObjectId(storylineId) });
        } catch (error) {
            console.error("Error in Storyline.getStorylineById:", error);
            throw error;
        }
    }



};

export default Storyline;