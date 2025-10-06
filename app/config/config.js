'use strict';

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Use a global variable to store the sequelize instance.
// This is the key to preventing multiple connection pools in a serverless environment.
if (!global.sequelize) {
  global.sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USERNAME,
    process.env.DB_PASSWORD,
    {
      host: process.env.DB_HOST,
      dialect: 'postgres',
      port: process.env.DB_PORT,
      dialectModule: require('pg'),
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
      logging: false,
      pool: {
        max: 5,         // A low number is critical for serverless.
        min: 0,
        acquire: 30000,
        idle: 10000     // Close idle connections quickly.
      },
    }
  );
}

const sequelize = global.sequelize;

const connectToPostgresDb = () => {
  // Return the single, cached instance.
  return sequelize;
};

module.exports = { connectToPostgresDb };