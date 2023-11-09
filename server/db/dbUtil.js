const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../.env') });
const writerEndpoint = process.env.NEPTUNE_WRITE_ENDPOINT;
const readerEndpoint = process.env.NEPTUNE_READ_ENDPOINT;

const writeToNeptune = (query, parameters) => {
    // Use the writer endpoint
    const db = new DatabaseConnection(writerEndpoint);
    return db.execute(query, parameters);
}

const readFromNeptune = (query, parameters) => {
    // Use the reader endpoint
    const db = new DatabaseConnection(readerEndpoint);
    return db.query(query, parameters);
}

module.exports = {
    writeToNeptune,
    readFromNeptune,
};