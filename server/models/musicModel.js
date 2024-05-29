import { connect } from '../db/db.js'; // Adjust with your actual connection file path
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

class Music {
    constructor({
        _id,
        trackName,
        partType,
        bpm,
        name,
        description,
        uri,
        length,
        key,
    } = {}) {
        this._id = _id ? new ObjectId(_id) : new ObjectId();
        this.trackName = trackName;
        this.partType = partType;
        this.bpm = bpm;
        this.name = name;
        this.description = description;
        this.uri = uri;
        this.length = length;
        this.key = key;
    }

    static get collectionName() {
        return 'music'; // Name of the collection in the database
    }

    static async insertOne(music) {
        const db = await connect();
        const { insertedId } = await db.collection(this.collectionName).insertOne(music);
        return insertedId;
    }

    static async findOne(query) {
        const db = await connect();
        return db.collection(this.collectionName).findOne(query);
    }

    static async findByTrackNameAndPartType(trackName, partType) {
        const db = await connect();
        return db.collection(this.collectionName).findOne({ trackName, partType });
    }

    static async findAllByTrackName(trackName) {
        const db = await connect();
        return db.collection(this.collectionName).find({ trackName }).toArray();
    }
}

export default Music;
