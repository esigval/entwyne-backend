import { connect } from '../db/db.js';
import Storyline from '../models/Storylines.js';
import storylineTest from '../prompts/storylineTemplateTest.js';

const updateStoryline = async (req, next) => {
  try {
    console.log('Connecting to the database...');
    const database = await connect();
    console.log('Database connected.');

    console.log('Creating new storyline...');
    const newStoryline = new Storyline(storylineTest);
    console.log('New storyline created:', newStoryline);

    console.log('Updating storyline in the database...');
    const result = await database.collection('storylines').updateOne(
      { storyName: "Test Story" },
      { $set: { storyline: newStoryline.storyline } }
    );
    console.log('Update result:', result);
  } catch (error) {
    console.error('An error occurred:', error);
  }
}

updateStoryline();