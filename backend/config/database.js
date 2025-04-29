require('dotenv').config();
const mongoose = require('mongoose');

const DB = process.env.DATABASE_URL;

async function dbConnection() {
  await mongoose.connect(DB);
  console.log('DB connection successful!');
}

module.exports = dbConnection;