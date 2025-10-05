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
            logging: false, // This line disables query logging
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