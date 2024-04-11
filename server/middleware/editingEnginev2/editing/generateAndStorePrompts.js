import Prompts from "../../../models/promptModel.js"; // Import your Prompts model
import narrativeClips from '../rawDataTests/narrativeClips.json' assert { type: 'json' };
import { ObjectId } from 'mongodb'; // Import the ObjectId constructor

const generateAndStorePrompts = async (twyneId, storyId, storylineId, userId, storylineInstance) => {
    try {
        const prompts = storylineInstance.structure.flatMap((block, index) => 
            block.clips.map((clip) => ({
                order: block.order,
                twyneId: new ObjectId(twyneId), // Ensure twyneId is valid ObjectId
                storylineId: new ObjectId(storylineId), // Ensure storylineId is valid ObjectId
                storyId: new ObjectId(storyId), // Ensure storyId is valid ObjectId
                prompt: clip.prompt,
                mediaType: clip.type,
                promptTitle: block.part, // Assuming 'part' as the title
                collected: false,
                userId: new ObjectId(userId), // Convert to ObjectId
                createdAt: new Date(),
                lastUpdated: new Date(),
            }))
        );

        let createdPrompts;

        // Insert the prompts and capture their IDs
        try {
            createdPrompts = await Prompts.insertMany(prompts);
        } catch (error) {
            console.error("Error inserting prompts:", error);
            return;
        }

        // Iterate over the structure to update each clip with its corresponding promptId
        let promptIndex = 0; // To keep track of the current prompt
        storylineInstance.structure.forEach((block) => {
            block.clips.forEach((clip) => {
                // Assuming createdPrompts[promptIndex] contains the necessary _id
                if (createdPrompts && createdPrompts[promptIndex]) {
                    clip.promptId = createdPrompts[promptIndex]._id.toString(); // Attach the promptId to the clip
                    promptIndex++;
                }
            });
        });

        console.log(JSON.stringify(storylineInstance, null, 2));

        // At this point, storylineInstance has been updated with promptIds
        // Next, you'd save or update the modified storylineInstance in your database

        return storylineInstance;

    } catch (error) {
        console.error("Error during the entire prompt generation and storing process:", error);
    }
};

export default generateAndStorePrompts;


// Usage

const updatedStorylineInstance = await generateAndStorePrompts('65f13b5b3c54a131c18aed0a', '65e8f8ee5044800bdf5e840a', '661725d87d971fe6ab48f089', '660d81337b0c94b81b3f1744', narrativeClips);


console.log(JSON.stringify(updatedStorylineInstance, null, 2));