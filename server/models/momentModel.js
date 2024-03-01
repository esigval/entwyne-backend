import { connect } from '../db/db.js'; // Adjust with your actual connection file path
import { ObjectId } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

class Moment {
    constructor({
        _id,
        associatedPromptId,
        audioUri,
        beatTag,
        createdAt,
        filename,
        s3ProcessedUri,
        s3FilePath,
        s3Uri,
        s3UriThumbnail,
        sentiment,
        thumbnail,
        thumbnailUrl,
        transcription,
        transcriptionUrl,
        videoUri,
        videoSettingsObjectID,
        webmFilePath,
        pictureUri,
        mediaType,
        storylineId,
        userId
    } = {}) {
        this._id = new ObjectId(_id);
        this.associatedPromptId = new ObjectId(associatedPromptId);
        this.audioUri = audioUri;
        this.beatTag = beatTag;
        this.createdAt = createdAt;
        this.filename = filename;
        this.s3ProcessedUri= [{
            s3ProcessedUri: s3ProcessedUri,
            videoSettings: videoSettingsObjectID
          }];
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
        this.storylineId = new ObjectId(storylineId);
        this.userId = userId;
    }

    static get collectionName() {
        return 'moment'; // Name of the collection in the database
    }

    static async listAllByUserId(userId) {
        try {
            const db = await connect();
            const collection = db.collection(Moment.collectionName);
    
            // Get all Moments for a specific user
            const userMoments = await collection.find({ userId: new ObjectId(userId) }).toArray();
    
            return userMoments;
        } catch (error) {
            console.error('Failed to get all moments for user:', error);
        }
    }

    
    
    static async getpictureUribyStorylineId(storylineId, numPictures) {
        try {
            const db = await connect();
            const collection = db.collection(Moment.collectionName);
    
            // Get all Moments that match the storylineId
            const matchingMoments = await collection.find({ storylineId: new ObjectId(storylineId) }).toArray();
    
            // Get the s3UriThumbnail or s3FilePath of the first numPictures matching Moments
            const s3UriThumbnails = matchingMomentfs.slice(0, numPictures).map(moment => moment.thumbnailUrl || moment.s3FilePath);
    
            return s3UriThumbnails;
        } catch (error) {
            console.error('Failed to get s3UriThumbnail or s3FilePath by storyline ID:', error);
        }
    }


    static async getId(momentInstance) {
        try {
            const db = await connect();
            const collection = db.collection(Moment.collectionName);
            const moment = await collection.findOne({ _id: new ObjectId(momentInstance._id) });
            return moment;
        } catch (error) {
            console.error("Error in Moment.getId:", error);
            throw error;
        }
    }

    static async findByStorylineIdWithThumbnail(id) {
        try {
            const db = await connect();
            const collection = db.collection(Moment.collectionName);
            const moments = await collection.find({ id, thumbnailUrl: { $ne: null } }).toArray();
            return moments;
        } catch (error) {
            console.error("Error in Moment.findByStorylineIdWithThumbnail:", error);
            throw error;
        }
    }
    static async findByMomentIdWithDetails(momentId) {
        try {
            const db = await connect();
            const collection = db.collection(Moment.collectionName);
            const moment = await collection.findOne({ _id: new ObjectId(momentId) });
            if (moment && moment.transcription && moment.thumbnailUrl) {
                return moment;
            } else {
                return null;
            }
        } catch (error) {
            console.error("Error in Moment.findByMomentIdWithDetails:", error);
            throw error;
        }
    }

    static async deleteOne(momentId) {
        try {
            const db = await connect();
            const collection = db.collection(Moment.collectionName);
            const result = await collection.deleteOne({ _id: new ObjectId(momentId) });
            return result;
        } catch (error) {
            console.error("Error in Moment.delete:", error);
            throw error;
        }
    }

    static async createPictureMoments({ associatedPromptId, key, storylineId }) {
        try {
            const db = await connect();
            const collection = db.collection(Moment.collectionName);
    
            // Check if the S3 bucket name is set
            if (!process.env.S3_POST_BUCKET_NAME) {
                throw new Error('S3_POST_BUCKET_NAME environment variable is not set');
            }
    
            // Create a new instance of Moment
            const newMoment = {
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
            await collection.insertOne(newMoment);
    
            // Return the newMoment object
            return newMoment;
        } catch (error) {
            console.error("Error in Moment.createPictureMoments:", error);
            throw error; // Rethrow the error for the caller to handle
        }
    }
    

    static async getMomentUrls(momentId) {
        const db = await connect();
        const collection = db.collection(Moment.collectionName);
        const moment = await collection.findOne({ _id: new ObjectId(momentId) });
    
        // Return the s3FilePath and s3Uri properties
        return { s3FilePath: moment.s3FilePath, s3Uri: moment.s3Uri };
    }

    static async deleteOne(momentId, userId) {
        try {
            const db = await connect();
            const collection = db.collection(Moment.collectionName);

            // First, find the moment
            const moment = await collection.findOne({ _id: new ObjectId(momentId) });
            if (!moment) {
                return { status: 404, message: 'Moment not found.' };
            }

            // Check if the user owns the moment
            if (moment.userId.toString() !== userId.toString()) {
                return { status: 403, message: 'You do not have permission to delete this moment.' };
            }

            // If the user owns the moment, delete it
            const result = await collection.deleteOne({ _id: new ObjectId(momentId) });
            if (result.deletedCount === 1) {
                return { status: 200, message: 'Successfully deleted moment.' };
            } else {
                return { status: 404, message: 'Moment not found.' };
            }
        } catch (error) {
            console.error("Error in DELETE /moment/:id:", error);
            return { status: 500, message: 'Internal server error.' };
        }
    }

}





export default Moment;