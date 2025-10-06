'use strict';

const Sequelize = require('sequelize');
const { connectToPostgresDb } = require('@/app/config/config.js');

const sequelize = connectToPostgresDb();
const db = {};

// Explicitly require all model classes.
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

// Correctly add each imported model class to the db object.
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