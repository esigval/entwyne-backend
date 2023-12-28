import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();
const encodedPassword = encodeURIComponent(process.env.MONGO_DOCUMENT_DB_PASSWORD);
const username = "devdb"; // Your username
const host = "localhost";
const port = "27017";
const tlsOptions = "?tls=true&tlsAllowInvalidHostnames=true&tlsCAFile=global-bundle.pem&retryWrites=false";
const dbName = process.env.MONGODB_DB;


const url = process.env.MONGODB_TUNNEL_URI
const ca = './global-bundle.pem';

console.log('Attempting to connect to the database...');
console.log(url);

const connect = async () => {
  try {
    const client = new MongoClient(url, {
      tlsCAFile: ca
    });

    await client.connect();
    console.log('Connected successfully to the database');
    return client.db(dbName);
  } catch (err) {
    console.error('Connection to the database failed:', err);
    throw err;
  }
};

async function testDbConnection() {
  try {
    const db = await connect();
    console.log('Database connection test succeeded');
  } catch (err) {
    console.error('Database connection test failed:', err);
  }
}

testDbConnection();

export { connect, testDbConnection };
