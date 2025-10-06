'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('@/app/config/config.js').connectToPostgresDb();

class OrderItem extends Model {
  static associate(models) {
    this.belongsTo(models.Order, { foreignKey: 'order_id', as: 'order' });
    this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  }
}

OrderItem.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  orderId: { type: DataTypes.UUID, allowNull: false, field: 'order_id' },
  productId: { type: DataTypes.UUID, allowNull: false, field: 'product_id' },
  quantity: { type: DataTypes.INTEGER, allowNull: false },
  priceAtPurchase: { type: DataTypes.DECIMAL(10, 2), allowNull: false, field: 'price_at_purchase' },
}, {
  sequelize,
  modelName: 'OrderItem',
  tableName: 'order_items',
  timestamps: false,
});

module.exports = OrderItem;
