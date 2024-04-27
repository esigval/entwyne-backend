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
        sentiment,
        transcription,
        videoSettings,
        videoUri,
        mediaType,
        storylineId,
        userId,
        contributorId,
        thumbnailUri,
        stampedTranscription,
        lastUpdated,
        proxyUri,
    } = {}) {
        this._id = _id ? new ObjectId(_id) : new ObjectId();
        this.associatedPromptId = associatedPromptId ? new ObjectId(associatedPromptId) : undefined;
        this.audioUri = audioUri;
        this.beatTag = beatTag;
        this.createdAt = createdAt || new Date();
        this.sentiment = sentiment;
        this.transcription = transcription;
        this.videoSettings = videoSettings ? new ObjectId(videoSettings) : undefined;
        this.videoUri = videoUri;
        this.mediaType = mediaType;
        this.storylineId = storylineId ? new ObjectId(storylineId) : undefined;
        this.userId = userId ? new ObjectId(userId) : undefined;
        this.contributorId = contributorId ? new ObjectId(contributorId) : undefined;
        this.thumbnailUri = thumbnailUri;
        this.stampedTranscription = stampedTranscription;
        this.lastUpdated = lastUpdated || new Date();
        this.proxyUri = proxyUri;
    }

    static get collectionName() {
        return 'moments'; // Name of the collection in the database
    }


    static async listAllByUserId(userId) {
        try {
            const db = await connect();
            const collection = db.collection(Moment.collectionName);

            // Convert userId to ObjectId
            const userIdAsObjectId = new ObjectId(userId);

            // Get all Moments for a specific user
            const userMoments = await collection.find({ userId: userIdAsObjectId }).toArray();

            return userMoments;
        } catch (error) {
            console.error('Failed to get all moments for user:', error);
        }
    }

    static async getProxyUrisMap() {
        try {
            const db = await connect();
            const collection = db.collection(Moment.collectionName);

            // Get all Moments
            const moments = await collection.find({}).toArray();

            // Map each Moment's _id to its proxyUri
            const proxyUrisMap = moments.reduce((map, moment) => {
                map[moment._id.toString()] = moment.proxyUri;
                return map;
            }, {});

            return proxyUrisMap;
        } catch (error) {
            console.error('Failed to get proxy URIs map:', error);
            throw error;
        }
    }



    static async updateMoment({ momentId, update }) {
        try {
            const db = await connect();
            const collection = db.collection(Moment.collectionName);
            // find moment by id and update it
            const result = await collection.updateOne(
                { _id: new ObjectId(momentId) },
                {
                    $set: {
                        ...update,
                        lastUpdated: new Date() // Add this line
                    }
                }
            );
            return result;
        } catch (error) {
            console.error('Failed to update moment:', error);
        }
    }

    static async createMoment({ associatedPromptId, contributorId, userId }) {
        try {
            const db = await connect();
            const collection = db.collection(Moment.collectionName);

            // convert userId and contributorId to ObjectId if they're not already
            const userIdAsObjectId = userId instanceof ObjectId ? userId : new ObjectId(userId);
            const contributorIdAsObjectId = contributorId instanceof ObjectId ? contributorId : new ObjectId(contributorId);
            const associatedPromptIdAsObjectId = associatedPromptId instanceof ObjectId ? associatedPromptId : new ObjectId(associatedPromptId);

            // Create a new instance of Moment
            const newMoment = new Moment({ associatedPromptId: associatedPromptIdAsObjectId, userId: userIdAsObjectId, contributorId: contributorIdAsObjectId });

            // Insert the new instance into the database
            await collection.insertOne(newMoment);

            // Return the newMoment object
            return newMoment;
        } catch (error) {
            console.error('Failed to create empty moment:', error);
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

    static async findById(momentId) {
        try {
            const db = await connect();
            const collection = db.collection(Moment.collectionName);
            const moment = await collection.findOne({ _id: new ObjectId(momentId) });
            return moment;
        } catch (error) {
            console.error("Error in Moment.findById:", error);
            throw error;
        }
    }

    static async findProxyUriById(momentId) {
        try {
            const db = await connect();
            const collection = db.collection(Moment.collectionName);
            const moment = await collection.findOne({ _id: new ObjectId(momentId) });
            return moment.proxyUri;
        } catch (error) {
            console.error("Error in Moment.findProxyUriById:", error);
            throw error;
        }
    }

}





export default Moment;