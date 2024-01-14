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
    
            // Get the pictureUri of the first numPictures matching Twynes
            const pictureUris = matchingTwynes.slice(0, numPictures).map(twyne => twyne.pictureUri);
    
            return pictureUris;
        } catch (error) {
            console.error('Failed to get picture URIs by storyline ID:', error);
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
    
            // Create a new instance of Twyne
            const newTwyne = new Twyne({
                _id: new ObjectId(),
                associatedPromptId: new ObjectId(associatedPromptId),
                filename: key,
                mediaType: `picture`,
                createdAt: new Date(),
                s3FilePath: `https://${process.env.S3_POST_BUCKET_NAME}.s3.amazonaws.com/${key}`,
                s3Uri: `s3://${process.env.S3_POST_BUCKET_NAME}/${key}`,
                storylineId: storylineId,
                beatType: `b-roll`,

            });
    
            // Insert the new instance into the database
            const result = await collection.insertOne(newTwyne);
    
            // Return the result
            return result;
        } catch (error) {
            console.error("Error in Twyne.createNewRecord:", error);
        }
    }


}





export default Twyne;