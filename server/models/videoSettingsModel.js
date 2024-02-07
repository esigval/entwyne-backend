import { connect } from '../db/db.js'; // Adjust with your actual connection file path

class VideoSettings {
    constructor({
        _id,
        settingName,
        aspectRatio,
        frameRate,
    }) {
        this._id = _id;
        this.settingName = settingName;
        this.aspectRatio = aspectRatio;
        this.frameRate = frameRate;
    }

    static get collectionName() {
        return 'videoSettings'; // Name of the collection in the database
    }

    static async create(data) {
        try {
            const db = await connect();
            const collection = db.collection(VideoSettings.collectionName);
            const result = await collection.insertOne(data);
            // Construct the new object with the insertedId
            return new VideoSettings({ ...data, _id: result.insertedId });
        } catch (error) {
            console.error("Error in VideoSettings.create:", error);
            throw error;
        }
    }

    static async getVideoSettings(data) {
        try {
            const db = await connect();
            const collection = db.collection(VideoSettings.collectionName);
            const settings = await collection.findOne({ _id: data });
            return settings ? {
                aspectRatio: settings.aspectRatio,
                frameRate: settings.frameRate
            } : null;
        } catch (error) {
            console.error("Error in VideoSettings.getVideoSettings:", error);
            throw error;
        }
    }
}

export default VideoSettings;