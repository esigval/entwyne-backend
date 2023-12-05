import { connect } from '../db/db.js';
import Storyline from '../models/Storylines.js';

let storyTemplate = "Test Template"; // replace with your template

const createStorylineFromTemplate = async (storyTemplate) => {
    try {
        const database = await connect();
        const template = await database.collection('storylineTemplates').findOne({ templateName: storyTemplate });
        
        if (!template) {
            throw new Error('Template not found');
        }

        const storyline = new Storyline(template);
        const result = await database.collection('storylines').insertOne(storyline);
        console.log(result);
        return result;
    } catch (error) {
        console.error('Error creating storyline:', error);
    }
};

export default createStorylineFromTemplate;

// Test Function createStorylineFromTemplate(storyTemplate);