import {connect} from '../db/db.js'; // Adjust based on your actual DB import
import Prompts from '../models/Prompts.js'; // Adjust based on your actual model import
import { ObjectId } from 'mongodb'; // Adjust based on your actual DB import

const processStorylineAndCreatePrompts = async (storylineIdString) => {
    try {
        const database = await connect();
        const objectId = new ObjectId(storylineIdString);
        const storyDocument = await database.collection('storylines').findOne({ _id: objectId });

        if (!storyDocument) {
            throw new Error('Story not found');
        }

        const updatedStoryline = await Promise.all(storyDocument.storyline.map(async (item) => {
            const promptData = new Prompts(item);
            const result = await database.collection('prompts').insertOne(promptData);
            return { ...item, promptId: result.insertedId };
        }));

        await database.collection('storylines').updateOne(
            { _id: objectId },
            { $set: { storyline: updatedStoryline } }
        );

        return updatedStoryline;
    } catch (error) {
        console.error('Error processing storyline:', error);
        throw error; // Or handle error as per your application's error handling strategy
    }
};

processStorylineAndCreatePrompts('656e4b6af48d92749872e5ec'); // Replace with your storyline ID