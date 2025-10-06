'use strict';

const { Sequelize } = require('sequelize');
require('dotenv').config();

// Cache the Sequelize instance in a global variable to avoid re-creation
// This is crucial for serverless environments like Vercel
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
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
      },
    }
  );
}

const sequelize = global.sequelize;

const connectToPostgresDb = async () => {
  try {
    // We only need to authenticate once. We can add a flag to prevent re-authentication.
    if (!global.isDbAuthenticated) {
        await sequelize.authenticate();
        console.log('Connection to postgres established successfully!');
        global.isDbAuthenticated = true;
    }
  } catch (err) {
    console.error(`Unable to connect to postgres database: ${err}`);
    // Re-throw to indicate a failed connection attempt
    throw err;
  }
  return sequelize;
};

module.exports = { connectToPostgresDb };