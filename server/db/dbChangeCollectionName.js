import { connect } from './db.js';

// Write a function that renames a MongoDB collection
const renameCollection = async () => {
    const db = await connect();
    await db.collection('twynemedia').rename('twynes');
    console.log('Collection renamed');
};

renameCollection();