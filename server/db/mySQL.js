const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, '../../.env') });

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.LOCAL_DB_ADMIN_USER,
    password: process.env.LOCAL_DB_PASSWORD,
    database: process.env.LOCAL_DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

module.exports = pool;
