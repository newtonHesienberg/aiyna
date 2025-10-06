'use strict';

const { Sequelize } = require('sequelize');
require('dotenv').config();

// A global variable to hold the single, cached Sequelize instance.
// This is crucial for serverless environments to prevent creating new connection pools on every invocation.
let sequelize;

const connectToPostgresDb = () => {
  // If the instance already exists, return it immediately.
  if (sequelize) {
    return sequelize;
  }

  // Otherwise, create a new instance and cache it in the global variable.
  sequelize = new Sequelize(
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
      logging: false, // Disables query logging for cleaner console output.
      pool: {
        max: 5,         // Max connections per serverless instance.
        min: 0,
        acquire: 30000, // Max time (ms) to wait for a connection.
        idle: 10000     // Max time (ms) a connection can be idle before being released.
      },
    }
  );

  console.log('Database connection object initialized.');
  
  // Authenticate the connection once
  sequelize.authenticate()
    .then(() => console.log('Connection to postgres established successfully!'))
    .catch(err => console.error(`Unable to connect to postgres database: ${err}`));
    
  return sequelize;
};

module.exports = { connectToPostgresDb };
