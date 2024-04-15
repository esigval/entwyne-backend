import data from './testTwyne.json' assert { type: 'json' };
import Twyne from '../../models/twyneModel.js'
import { ObjectId } from 'mongodb';

async function createTwynes(data, userId, storyId) {
    if (typeof data === 'string') {
        data = JSON.parse(data);
    }
    try {
        const results = [];
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
        return results;
    } catch (error) {
        console.error("Failed to create Twyne models:", error);
        throw error;
    }
}

export default createTwynes;

/*createTwyneModels(data, userId, storyId)
    .then(results => console.log("Successfully created Twyne models:", results))
    .catch(error => console.error("An error occurred:", error));*/