import { MongoClient } from 'mongodb';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dotenv from 'dotenv';

dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Make sure to set your environment variables in .env or your environment
const username = encodeURIComponent(process.env.MONGO_DOCUMENT_DB_USER);
const password = encodeURIComponent(process.env.MONGO_DOCUMENT_DB_PASSWORD);
const clusterEndpoint = process.env.MONGO_DOCUMENT_DB_SSH_TUNNEL;
const dbName = process.env.MONGO_DOCUMENT_DB_NAME;
const replicaSet = process.env.MONGO_DOCUMENT_DB_REPLICA_SET || 'rs0'; // Defaulting to 'rs0' if not specified
const readPreference = process.env.MONGODB_READ_PREFERENCE || 'secondaryPreferred'; // Defaulting to 'secondaryPreferred' if not specified

// Assuming global-bundle.pem is in the root of your project directory
const caFilePath = path.join(process.cwd(), 'server', 'etc', 'ssl', 'certs', 'global-bundle.pem');
const tlsCAFile = caFilePath

// Construct the connection string
const uri = `mongodb://${username}:${password}@${clusterEndpoint}/${dbName}?tls=true&replicaSet=${replicaSet}&readPreference=${readPreference}&retryWrites=false`;

// Create a new MongoClient
const client = new MongoClient(uri, {
  tlsCAFile,
  tlsAllowInvalidCertificates: true,
});

// Define the connect function
const connect = async () => {
  try {
    await client.connect();
    console.log('Connected successfully to the database');
    const db = client.db(dbName);
    
    // Your database interaction logic here

    return db;
  } catch (err) {
    console.error('Connection to the database failed:', err);
    throw err;
  }
};

// Export the connect function
export { connect };
