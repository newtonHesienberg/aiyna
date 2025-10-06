'use strict';

const Sequelize = require('sequelize');
const { connectToPostgresDb } = require('@/app/config/config.js');

const sequelize = connectToPostgresDb();
const db = {};

// Explicitly require all models to ensure they are loaded correctly.
// Each require statement imports the initialized model class.
const models = [
    require('./address'),
    require('./cart'),
    require('./cartitem'),
    require('./subcategory'),
    require('./category'),
    require('./coupon'),
    require('./feedback'),
    require('./Order'),
    require('./OrderItem'),
    require('./Product'),
    require('./productvariant'),
    require('./rating'),
    require('./spec'),
    require('./themesection'),
    require('./User'),
    require('./wishlist'),
    require('./wishlistitem'),
];

// Add each model class to the db object.
for (const model of models) {
    db[model.name] = model;
}

// Run the `associate` method for each model to build the relationships.
Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

