import { connect } from './db.js';

// Write a function that delets from MongoDB all the documents from the collection prompts
const deletePrompts = async () => {
    const db = await connect();
    await db.collection('twynes').deleteMany({});
    console.log('All prompts deleted');
};

deletePrompts();