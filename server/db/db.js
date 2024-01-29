import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const dbName = process.env.MONGO_DOCUMENT_DB_NAME;
const url = process.env.MONGODB_AMZ_URI;
const caBundle = './global-bundle.pem';

console.log('Attempting to connect to the database...');
console.log(url);

let db = null;

const connect = async () => {
  try {
    if (db) {
      console.log('Using existing database connection');
      return db;
    }

    const client = new MongoClient(url, {
      tlsCAFile: caBundle,
    });

    await client.connect();
    console.log('Connected successfully to the database');
    db = client.db(dbName);
    return db;
  } catch (err) {
    console.error('Connection to the database failed:', err);
    throw err;
  }
};

export { connect };