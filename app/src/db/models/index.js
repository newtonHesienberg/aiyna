'use strict';

const Sequelize = require('sequelize');
const { connectToPostgresDb } = require('../../../config/config.js');
const db = {};

let sequelize;

const initialize = async () => {
  if (db.sequelize) {
    return;
  }

  sequelize = await connectToPostgresDb();

  // Explicitly import and initialize each model
  const models = [
    require('./User')(sequelize, Sequelize.DataTypes),
    require('./Product')(sequelize, Sequelize.DataTypes),
    require('./Creation')(sequelize, Sequelize.DataTypes),
    require('./Order')(sequelize, Sequelize.DataTypes),
    require('./OrderItem')(sequelize, Sequelize.DataTypes),
  ];

  for (const model of models) {
    db[model.name] = model;
  }

  Object.keys(db).forEach(modelName => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.sequelize = sequelize;
  db.Sequelize = Sequelize;
};

// Initialize and export
initialize();

module.exports = db;