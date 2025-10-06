'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('@/app/config/config.js').connectToPostgresDb();

class Rating extends Model {
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  }
}

Rating.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  userId: { type: DataTypes.STRING, allowNull: false, field: 'user_id' },
  productId: { type: DataTypes.UUID, allowNull: false, field: 'product_id' },
  rating: { type: DataTypes.INTEGER, allowNull: false, validate: { min: 1, max: 5 } },
  reviewText: { type: DataTypes.TEXT, field: 'review_text' },
}, {
  sequelize,
  modelName: 'Rating',
  tableName: 'ratings',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Rating;
