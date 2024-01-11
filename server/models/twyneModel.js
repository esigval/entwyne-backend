import { connect } from '../db/db.js'; // Adjust with your actual connection file path
import { ObjectId } from 'mongodb';

class Twyne {
    constructor({
        _id,
        associatedPromptId,
        audioUri,
        beatTag,
        createdAt,
        filename,
        s3FilePath,
        s3Uri,
        s3UriThumbnail,
        sentiment,
        thumbnail,
        thumbnailUrl,
        transcription,
        transcriptionUrl,
        videoUri,
        webmFilePath,
    } = {}) {
        this._id = _id;
        this.associatedPromptId = associatedPromptId;
        this.audioUri = audioUri;
        this.beatTag = beatTag;
        this.createdAt = createdAt;
        this.filename = filename;
        this.s3FilePath = s3FilePath;
        this.s3Uri = s3Uri;
        this.s3UriThumbnail = s3UriThumbnail;
        this.sentiment = sentiment;
        this.thumbnail = thumbnail;
        this.thumbnailUrl = thumbnailUrl;
        this.transcription = transcription;
        this.transcriptionUrl = transcriptionUrl;
        this.videoUri = videoUri;
        this.webmFilePath = webmFilePath;
    }

    static get collectionName() {
        return 'twynes'; // Name of the collection in the database
    }

    static async getId(twyneInstance) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const twyne = await collection.findOne({ _id: new ObjectId(twyneInstance._id) });
            return twyne;
        } catch (error) {
            console.error("Error in Twyne.getId:", error);
            throw error;   
        }
    }

    static async findByStorylineIdWithThumbnail(id) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const twynes = await collection.find({ id, thumbnailUrl: { $ne: null } }).toArray();
            return twynes;
        } catch (error) {
            console.error("Error in Twyne.findByStorylineIdWithThumbnail:", error);
            throw error;
        }
    }
    static async findByTwyneIdWithDetails(twyneId) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const twyne = await collection.findOne({ _id: new ObjectId(twyneId) });
            if (twyne && twyne.transcription && twyne.thumbnailUrl) {
                return twyne;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in Twyne.findByTwyneIdWithDetails:", error);
            throw error;
        }
    }

}





export default Twyne;