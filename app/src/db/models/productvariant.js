'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('@/app/config/config.js').connectToPostgresDb();

class ProductVariant extends Model {
  static associate(models) {
    this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  }
}

ProductVariant.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false, field: 'product_id' },
  size: { type: DataTypes.STRING, allowNull: true },
  color: { type: DataTypes.STRING, allowNull: true },
  stockQuantity: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0, field: 'stock_quantity' },
}, {
  sequelize,
  modelName: 'ProductVariant',
  tableName: 'product_variants',
  timestamps: false,
});

module.exports = ProductVariant;
