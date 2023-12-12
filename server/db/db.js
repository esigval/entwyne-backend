import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const url = `mongodb+srv://${process.env.MONGODB_USER}:${process.env.MONGODB_PASSWORD}` +
            `@cluster0.afrmpli.mongodb.net/`;
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