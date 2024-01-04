import { connect } from '../db/db.js'; // Adjust with your actual connection file path
import { ObjectId } from 'mongodb';

class StorylineTemplate {
    constructor({
        templateName,
        templateStoryStructure,
        templateLengthInTotal,
        averageCutLength,
        maxInterviews,
        transitionFramesBetweenInterviews,
        rulesHeader,
        storylineParts
    }) {
        this.templateName = templateName;
        this.templateStoryStructure = templateStoryStructure;
        this.templateLengthInTotal = templateLengthInTotal;
        this.averageCutLength = averageCutLength;
        this.maxInterviews = maxInterviews;
        this.transitionFramesBetweenInterviews = transitionFramesBetweenInterviews;
        this.rulesHeader = rulesHeader;
        this.storylineParts = storylineParts || []; // Default to empty array if not provided
    }

    static get collectionName() {
        return 'storylineTemplates'; // Name of the collection in the database
    }

    static async create(data) {
        try {
            const db = await connect();
            const collection = db.collection(StorylineTemplate.collectionName);
            const result = await collection.insertOne(data);
            // Construct the new object with the insertedId
            return new StorylineTemplate({ ...data, _id: result.insertedId });
        } catch (error) {
            console.error("Error in Storyline.create:", error);
            throw error;
        }
    }
    
    static async getStorylineTemplateParts(data) {
        try {
            const db = await connect();
            const collection = db.collection(StorylineTemplate.collectionName);
            const template = await collection.findOne({ templateName: data });
            return template ? template.storylineParts : null;
        } catch (error) {
            console.error("Error in StorylineTemplate.getStorylineParts:", error);
            throw error;
        }
    }
}



export default StorylineTemplate;
