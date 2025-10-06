'use strict';

const Sequelize = require('sequelize');
const { connectToPostgresDb } = require('@/app/config/config.js');

let db = {};

async function initialize() {
    // Only proceed if the db object hasn't been initialized
    if (Object.keys(db).length > 0) return db;

    const sequelize = await connectToPostgresDb();

    try {
        const models = [
            require('./address'), require('./cart'), require('./cartitem'),
            require('./category'), require('./coupon'), require('./feedback'),
            require('./Order'), require('./OrderItem'), require('./Product'),
            require('./productvariant'), require('./rating'), require('./spec'),
            require('./subcategory'), require('./themesection'), require('./User'),
            require('./wishlist'), require('./wishlistitem'),
        ];

        for (const modelDefiner of models) {
            const model = modelDefiner(sequelize, Sequelize.DataTypes);
            db[model.name] = model;
        }

        Object.keys(db).forEach(modelName => {
            if (db[modelName].associate) {
                db[modelName].associate(db);
            }
        });

        db.sequelize = sequelize;
        db.Sequelize = Sequelize;

    } catch (error) {
        console.error('Unable to initialize the database models:', error);
        process.exit(1);
    }

    return db;
}

// In development, hot-reloading can cause issues. We use a global variable
// to cache the promise so we don't re-initialize on every change.
let dbPromise;
if (process.env.NODE_ENV === 'development') {
    if (!global._dbPromise) {
        global._dbPromise = initialize();
    }
    dbPromise = global._dbPromise;
} else {
    dbPromise = initialize();
}

module.exports = dbPromise;