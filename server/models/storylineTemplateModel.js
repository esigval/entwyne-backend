import { connect } from '../db/db.js'; // Adjust with your actual connection file path
import { ObjectId } from 'mongodb';

class StorylineTemplate {
    constructor({
        _id,
        templateName,
        templateGoal,
        templateStructure,
        leadingQuestion,
        templateLengthInTotal,
        averageCutLength,
        maxInterviews,
        fillerFramesPerInterview,
        rulesHeader,
        storylineParts,
        bRoll,
    }) {
        this._id = _id;
        this.templateName = templateName;
        this.templateGoal = templateGoal;
        this.templateStructure = templateStructure;
        this.leadingQuestion = leadingQuestion;
        this.templateLengthInTotal = templateLengthInTotal;
        this.averageCutLength = averageCutLength;
        this.maxInterviews = maxInterviews;
        this.fillerFramesPerInterview = fillerFramesPerInterview;
        this.rulesHeader = rulesHeader;
        this.storylineParts = storylineParts || []; // Default to empty array if not provided
        this.bRoll = bRoll || []; // Default to empty array if not provided
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

    static async getTemplateDetails(data) {
        try {
            const db = await connect();
            const collection = db.collection(StorylineTemplate.collectionName);
            const template = await collection.findOne({ templateName: data });
            return template ? {
                templateGoal: template.templateGoal,
                templateStructure: template.templateStructure,
                leadingQuestion: template.leadingQuestion
            } : null;
        } catch (error) {
            console.error("Error in StorylineTemplate.getTemplateDetails:", error);
            throw error;
        }
    }
}



export default StorylineTemplate;
