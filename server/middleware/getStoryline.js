import {connect} from '../db/db.js';
const storyName = "Test Story";

const getStoryline = async (req, res) => {
  try {
    const database = await connect();
    const storyDocument = await database.collection('storylines').findOne({ storyName: storyName });
    
    if (!storyDocument) {
      return res.status(404).send('Story not found.');
    }

    const storyline = storyDocument.storyline; // Assuming storyline is an array in your document

    // Convert each object in the storyline array to JSON, if necessary
    const storylineJson = storyline.map(item => JSON.stringify(item));
    console.log(storylineJson);

    res.json(storylineJson);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred while processing the request.');
  }
};

export default getStoryline;