import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const dbName = process.env.MONGODB_DB;
const url = process.env.MONGODB_URI;
// const ca = './global-bundle.pem';

console.log('Attempting to connect to the database...');
console.log(url);

const connect = async () => {
  try {
    const client = new MongoClient(url, {
      //tlsCAFile: ca
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
