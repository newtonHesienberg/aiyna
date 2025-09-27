'use strict';

const { Sequelize } = require('sequelize');
const config = require('./postgres.js');
let postgresDb;

const connectToPostgresDb = async () => {
  postgresDb = new Sequelize(
    config.database,
    config.user,
    config.password,
    {
      host: config.host,
      dialect: config.dialect,
      port: config.port,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        },
      },
    }
  );
  try {
    await postgresDb.authenticate();
    console.log('Connection to postgres established successfully!');
  } catch (err) {
    console.error(`Unable to connect to postgres database: ${err}`);
  }
};

const getPostgresDb = async () => {
  if (!postgresDb) {
    await connectToPostgresDb();
  }
  return postgresDb;
};

module.exports =  { getPostgresDb };
