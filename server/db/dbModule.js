const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });

// Connection URL and Database Name
const url = process.env.MONGODB_URI;
const dbName = 'characters';

// Create a new MongoClient
const client = new MongoClient(url);

async function connect() {
  if (!client.isConnected()) {
    await client.connect();
  }
  return client.db(dbName);
}

// Function to get nodes from the database
async function getNodes() {
  const db = await connect();
  const collection = db.collection('nodes');
  return collection.find({}).toArray(); // Adjust the query as needed
}

// Export the functions that can be used by other modules
module.exports = {
  getNodes,
};
