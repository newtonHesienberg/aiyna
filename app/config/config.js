// file: app/config/config.js
'use strict';

const { Sequelize } = require('sequelize');
require('dotenv').config();

let sequelize;

const connectToPostgresDb = async () => {
    if (sequelize) {
        return sequelize;
    }

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
                    rejectUnauthorized: false
                },
            },
            logging: false, // Disables query logging
            // Add this pool configuration
            pool: {
                max: 5, // Maximum number of connection in pool
                min: 0, // Minimum number of connection in pool
                acquire: 30000, // The maximum time, in milliseconds, that pool will try to get connection before throwing error
                idle: 10000 // The maximum time, in milliseconds, that a connection can be idle before being released
            }
        }
    );

    try {
        await sequelize.authenticate();
        console.log('Connection to postgres established successfully!');
    } catch (err) {
        console.error(`Unable to connect to postgres database: ${err}`);
    }

    return sequelize;
};

module.exports = { connectToPostgresDb };