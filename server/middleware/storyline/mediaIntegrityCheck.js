import Moment from '../../models/momentModel.js'; // Import the Moment model
import Storyline from '../../models/storylineModel.js'; // Import the Storyline model
import Prompts from '../../models/promptModel.js'; // Import the Prompts model

const checkMomentProcessing = async (req, res, next) => {
    try {
        const storylineId = req.params.storylineId; // Assuming the storylineId is in req.params

        const storyline = await Storyline.findById(storylineId); // Find the storyline using storylineId
        const structure = storyline.structure; // Extract the structure from the storyline

        for (const part of structure) {
            const clips = part.clips; // Extract the clips from the part
            const momentIds = clips.map(clip => clip.momentId).filter(momentId => momentId); // Get all momentIds from the clips

            const momentsArray = await Moment.findMultipleByIds(momentIds); // Use the findMultipleByIds function to find multiple moments by their ids

            const allProcessed = momentsArray.every(moment => moment.processed === true); // Check if all moments in momentsArray have processed set to true
            part.clipsExist = allProcessed; // Update the clipsExist property for the part

            // Log the status of each part's clipsExist
            console.log(`Part ${part.part}: clipsExist = ${part.clipsExist}`);
        }

        console.log(structure);

        // Check if all parts have clipsExist set to true
        const allClipsExist = structure.every(part => part.clipsExist === true);

        if (allClipsExist) {
            storyline.mediaIntegrityCheck = true; // Set mediaIntegrityCheck to true if all clipsExist are true
        } else {
            storyline.mediaIntegrityCheck = false; // Set mediaIntegrityCheck to false otherwise
        }

        const results = await Storyline.updateStoryline(
            storylineId,
            storyline
        );

        console.log(`Updated storyline ${storyline._id} with results:`, results);

        next(); // Pass to the next middleware
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error checking moment processing:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export default checkMomentProcessing;

// Test script
const runTest = async () => {
    // Mock request and response objects
    const req = {
        params: { storylineId: '666a876c1306071e51286bd2' }
    };
    const res = {
        status: (code) => ({
            json: (data) => console.log(`Response status: ${code}, data:`, data)
        })
    };
    const next = () => console.log('Next middleware called');

    // Run the middleware function
    await checkMomentProcessing(req, res, next);
};

runTest();