import Moment from '../../models/momentModel.js'; // Import the Moment model
import Storyline from '../../models/storylineModel.js'; // Import the Storyline model
import Prompts from '../../models/promptModel.js'; // Import the Prompts model

const checkMomentProcessing = async (req, res, callback) => {
    try {
        const storylineId = req.params.storylineId; // Assuming the storylineId is in req.params

        const storyline = await Storyline.findById(storylineId); // Find the storyline using storylineId
        const structure = storyline.structure; // Extract the structure from the storyline

        let allPartsProcessed = true;

        for (const part of structure) {
            const clips = part.clips; // Extract the clips from the part
            const momentIds = clips.map(clip => clip.momentId).filter(momentId => momentId); // Get all momentIds from the clips

            const momentsArray = await Moment.findMultipleByIds(momentIds); // Use the findMultipleByIds function to find multiple moments by their ids

            const allProcessed = momentsArray.every(moment => moment.processed === true); // Check if all moments in momentsArray have processed set to true
            part.clipsExist = allProcessed; // Update the clipsExist property for the part

            // Log the status of each part's clipsExist
            console.log(`Part ${part.part}: clipsExist = ${part.clipsExist}`);

            if (!allProcessed) {
                allPartsProcessed = false;
            }
        }

        console.log(structure);

        // Check if all parts have clipsExist set to true
        const allClipsExist = structure.every(part => part.clipsExist === true);

        storyline.mediaIntegrityCheck = allClipsExist; // Set mediaIntegrityCheck based on whether all clipsExist are true

        const results = await Storyline.updateStoryline(
            storylineId,
            storyline
        );

        console.log(`Updated storyline ${storyline._id} with results:`, results);

        callback(null, allPartsProcessed); // Pass the result to the callback
    } catch (error) {
        // Handle any errors that occur during the process
        console.error('Error checking moment processing:', error);
        callback(error, null); // Pass the error to the callback
    }
};

export default checkMomentProcessing;