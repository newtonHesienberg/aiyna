'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('@/app/config/config.js').connectToPostgresDb();

class Feedback extends Model {
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
  }
}

Feedback.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  userId: { type: DataTypes.STRING, allowNull: true, field: 'user_id' },
  subject: { type: DataTypes.STRING, allowNull: true },
  message: { type: DataTypes.TEXT, allowNull: false },
}, {
  sequelize,
  modelName: 'Feedback',
  tableName: 'feedback',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Feedback;
