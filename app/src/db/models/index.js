'use strict';

const Sequelize = require('sequelize');
const { connectToPostgresDb } = require('../../../config/config.js');

let dbPromise;

async function initialize() {
    const sequelize = await connectToPostgresDb();
    const db = {};

    try {
        // --- EXPLICIT MODEL LOADING ---
        // Add all your model files to this array.
        const models = [
            require('./address'),
            require('./cart'),
            require('./cartitem'),
            require('./category'),
            require('./coupon'),
            require('./feedback'),
            require('./Order'),
            require('./OrderItem'),
            require('./Product'),
            require('./productvariant'),
            require('./rating'),
            require('./spec'),
            require('./subcategory'),
            require('./themesection'),
            require('./User'),
            require('./wishlist'),
            require('./wishlistitem'),
        ];

        // Initialize each model and add it to the db object
        for (const modelDefiner of models) {
            const model = modelDefiner(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
        }

        // --- RUN ASSOCIATIONS ---
        Object.keys(db).forEach(modelName => {
            if (db[modelName].associate) {
                db[modelName].associate(db);
            }
        });

        db.sequelize = sequelize;
        db.Sequelize = Sequelize;

    } catch (error) {
        console.error('Unable to initialize the database:', error);
        process.exit(1);
    }

    return db;
}

if (process.env.NODE_ENV === 'development') {
    // In development, use a global variable to preserve the promise across HMR reloads
    if (!global._dbPromise) {
        global._dbPromise = initialize();
    }
    dbPromise = global._dbPromise;
} else {
    // In production, initialize once
    dbPromise = initialize();
}

module.exports = dbPromise;