import { connect } from '../../db/db.js';

// Collections to be targeted
const collections = ['prompts', 'stories', 'storylines', 'twynes', 'moments'];

async function deleteDocumentsByUserId(userId) {
    try {
        const db = await connect();

        // Iterate over each collection and delete documents matching userId
        for (const collectionName of collections) {
            const collection = db.collection(collectionName);
            const result = await collection.deleteMany({ userId: userId });
            console.log(`Deleted ${result.deletedCount} documents from ${collectionName}`);
        }
    } catch (err) {
        console.error('Error deleting documents:', err);
    }
}

export { deleteDocumentsByUserId };

// Usage example
deleteDocumentsByUserId('yourUserId')
    .then(() => console.log('Deletion process completed'))
    .catch(err => console.error('Error in deletion process:', err));
