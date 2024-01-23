import { connect } from '../db/db.js'; // Adjust with your actual connection file path
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

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
        pictureUri,
        mediaType,
        storylineId,
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
        this.pictureUri = pictureUri
        this.mediaType = mediaType;
        this.storylineId = storylineId;
    }

    static get collectionName() {
        return 'twynes'; // Name of the collection in the database
    }

    static async getpictureUribyStorylineId(storylineId, numPictures) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
    
            // Get all Twynes that match the storylineId
            const matchingTwynes = await collection.find({ storylineId: new ObjectId(storylineId) }).toArray();
    
            // Get the s3UriThumbnail or s3FilePath of the first numPictures matching Twynes
            const s3UriThumbnails = matchingTwynes.slice(0, numPictures).map(twyne => twyne.thumbnailUrl || twyne.s3FilePath);
    
            return s3UriThumbnails;
        } catch (error) {
            console.error('Failed to get s3UriThumbnail or s3FilePath by storyline ID:', error);
        }
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

    static async deleteOne(twyneId) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
            const result = await collection.deleteOne({ _id: new ObjectId(twyneId) });
            return result;
        } catch (error) {
            console.error("Error in Twyne.delete:", error);
            throw error;
        }
    }

    static async createPictureTwynes({ associatedPromptId, key, storylineId }) {
        try {
            const db = await connect();
            const collection = db.collection(Twyne.collectionName);
    
            // Check if the S3 bucket name is set
            if (!process.env.S3_POST_BUCKET_NAME) {
                throw new Error('S3_POST_BUCKET_NAME environment variable is not set');
            }
    
            // Create a new instance of Twyne
            const newTwyne = {
                _id: new ObjectId(),
                associatedPromptId: new ObjectId(associatedPromptId),
                filename: key,
                mediaType: 'picture',
                createdAt: new Date(),
                s3FilePath: `https://${process.env.S3_POST_BUCKET_NAME}.s3.amazonaws.com/${key}`,
                s3Uri: `s3://${process.env.S3_POST_BUCKET_NAME}/${key}`,
                storylineId: storylineId,
                beatType: 'b-roll'
            };
    
            // Insert the new instance into the database
            await collection.insertOne(newTwyne);
    
            // Return the newTwyne object
            return newTwyne;
        } catch (error) {
            console.error("Error in Twyne.createPictureTwynes:", error);
            throw error; // Rethrow the error for the caller to handle
        }
    }
    

    static async getTwyneUrls(twyneId) {
        const db = await connect();
        const collection = db.collection(Twyne.collectionName);
        const twyne = await collection.findOne({ _id: new ObjectId(twyneId) });
    
        // Return the s3FilePath and s3Uri properties
        return { s3FilePath: twyne.s3FilePath, s3Uri: twyne.s3Uri };
    }

}





export default Twyne;