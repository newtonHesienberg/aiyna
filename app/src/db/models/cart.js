'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('@/app/config/config.js').connectToPostgresDb();

class Cart extends Model {
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.hasMany(models.CartItem, { foreignKey: 'cart_id', as: 'items' });
  }
}

Cart.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  userId: { type: DataTypes.STRING, allowNull: false, unique: true, field: 'user_id' },
}, {
  sequelize,
  modelName: 'Cart',
  tableName: 'carts',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Cart;
