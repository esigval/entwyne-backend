import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { config } from '../config.js';

dotenv.config();

const environment = process.env.NODE_ENV || 'local';
const currentConfig = config[environment];

console.log(currentConfig);

let db = null;

const connect = async () => {
  try {
    if (db) {
      console.log('Using existing database connection');
      return db;
    }

    const url = currentConfig.MONGODB_URI;
    console.log(url);
    let clientOptions = {};

    if (environment === 'production') {
      const caBundle = './global-bundle.pem';
      clientOptions = {
        tlsCAFile: caBundle,
      };
    } else if (environment === 'development') {
      const caBundle = './global-bundle.pem';
      clientOptions = {
        tlsCAFile: caBundle,
      };
    }

    const client = new MongoClient(url, clientOptions);
    await client.connect();
    console.log(`Connected successfully to the database in ${environment} mode.`);
    db = client.db(process.env.MONGO_DOCUMENT_DB_NAME);
    return db;
  } catch (err) {
    console.error(`Connection to the database failed in ${environment} mode:`, err);
    throw err;
  }
};

export { connect };