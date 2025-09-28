'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const { connectToPostgresDb } = require('../../../config/config.js'); // Adjust path if needed
const basename = path.basename(__filename);
const db = {};

let sequelize;

const initialize = async () => {
  if (db.sequelize) {
    return; // Already initialized
  }

  try {
    sequelize = await connectToPostgresDb();

    // --- DYNAMIC MODEL LOADING ---
    // Read all files in the current directory
    fs.readdirSync(__dirname)
      .filter(file => {
        // Get all .js files that are not this file (index.js) and not hidden files
        return (
          file.indexOf('.') !== 0 &&
          file !== basename &&
          file.slice(-3) === '.js'
        );
      })
      .forEach(file => {
        // Require the model file and initialize it
        const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
        db[model.name] = model;
      });

    // --- RUN ASSOCIATIONS ---
    // This part remains the same
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
};

// Initialize and export
initialize();

module.exports = db;