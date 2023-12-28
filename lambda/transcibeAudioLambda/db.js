import { MongoClient } from 'mongodb';
// Import 'fs' module for reading the certificate file
import fs from 'fs';

// Since you are using Lambda, make sure these environment variables are set in the Lambda function configuration
const url = process.env.MONGODB_AMZ_URI;
const dbName = process.env.MONGODB_DB;

// Provide the path to your RDS combined CA bundle
const caBundle = './global-bundle.pem' // Update with the correct path

console.log('Attempting to connect to the database...');

const connect = async () => {
  try {
    // Updated MongoClient options for SSL
    const client = new MongoClient(url, {
        ssl: true,
        tlsCAFile: caBundle // use tlsCAFile instead of sslCA
      });
      

    await client.connect();
    console.log('Connected successfully to the database');
    return client.db(dbName);
  } catch (err) {
    console.error('Connection to the database failed:', err);
    throw err;
  }
};

export { connect };
