'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('@/app/config/config.js').connectToPostgresDb();

class CartItem extends Model {
  static associate(models) {
    this.belongsTo(models.Cart, { foreignKey: 'cart_id', as: 'cart' });
    this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  }
}

CartItem.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  cartId: { type: DataTypes.UUID, allowNull: false, field: 'cart_id' },
  productId: { type: DataTypes.UUID, allowNull: false, field: 'product_id' },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  color: { type: DataTypes.STRING },
  size: { type: DataTypes.STRING },
}, {
  sequelize,
  modelName: 'CartItem',
  tableName: 'cart_items',
  timestamps: false,
});

module.exports = CartItem;
