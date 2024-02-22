import { connect } from './db.js';

// Function to delete all documents from the 'prompts' collection
const deletePrompts = async () => {
    const db = await connect();
    await db.collection('prompts').deleteMany({});
    console.log('All prompts deleted');
};

// Function to delete all documents from the 'twynes' collection
const deleteMoments = async () => {
    const db = await connect();
    await db.collection('twynes').deleteMany({});
    console.log('All twynes deleted');
};

// Function to delete all documents from the 'stories' collection
const deleteStories = async () => {
    const db = await connect();
    await db.collection('stories').deleteMany({});
    console.log('All stories deleted');
};

// Function to delete all documents from the 'storylines' collection
const deleteStorylines = async () => {
    const db = await connect();
    await db.collection('storylines').deleteMany({});
    console.log('All storylines deleted');
};

// Call the functions
deletePrompts();
deleteMoments();
deleteStories();
deleteStorylines();