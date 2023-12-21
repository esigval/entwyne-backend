import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const url = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB;

console.log('Attempting to connect to the database...');
console.log(url);

const connect = async () => {
  try {
    const client = new MongoClient(url);
    await client.connect();
    console.log('Connected successfully to the database');
    return client.db(dbName);
  } catch (err) {
    console.error('Connection to the database failed:', err);
    throw err;
  }
};

export { connect };