import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
console.log(process.cwd())
dotenv.config();

// Connection URL and Database Name
const dbUser = process.env.MONGODB_USER;
const dbPassword = process.env.MONGODB_PASSWORD;
const url = `mongodb+srv://${dbUser}:${dbPassword}@cluster0.afrmpli.mongodb.net/`;
const dbName = process.env.MONGODB_DB;

console.log(url);

// Create a new MongoClient
const connect = async () => {
  const client = new MongoClient(url);
  await client.connect();
  return client.db(dbName);
}

// Export the functions that can be used by other modules
export {
  connect,
};