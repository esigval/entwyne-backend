import data from './testTwyne.json' assert { type: 'json' };
import Twyne from '../../models/twyneModel.js'
import Story from '../../models/storyModel.js' // Import the Story model
import { ObjectId } from 'mongodb';

async function createTwynes(data, userId, storyId) {
    console.log("Creating Twyne models from data:", data, userId, storyId)
    if (typeof data === 'string') {
        data = JSON.parse(data);
    }
    try {
        const results = [];
        // Extract storySummary from the top level of the data
        const storySummary = data.storySummary;

        for (let twyneData of data.twynes) {
            const twyneProps = {
                name: twyneData.name,
                theme: twyneData.theme,
                twyneSummary: twyneData.description,
                userId: new ObjectId(userId),
                storyId: new ObjectId(storyId)
            };
            const result = await Twyne.create(twyneProps);
            results.push(result);
        }

        // Update the storySummary in the Story model
        await Story.update(storyId, { storySummary: storySummary });

        return `Successfully created ${results.length} Twyne models.`;
    } catch (error) {
        console.error("Failed to create Twyne models:", error);
        throw error;
    }
}

export default createTwynes;