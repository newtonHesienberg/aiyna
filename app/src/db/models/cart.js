'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    static associate(models) {
      // A Cart belongs to one User
      Cart.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      // A Cart has many CartItems
      Cart.hasMany(models.CartItem, {
        foreignKey: 'cart_id',
        as: 'items'
      });
    }
  }
  Cart.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        field: 'user_id'
    }
  }, {
    sequelize,
    modelName: 'Cart',
    tableName: 'carts',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Cart;
};