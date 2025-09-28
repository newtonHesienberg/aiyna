'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class WishlistItem extends Model {
    static associate(models) {
      // A WishlistItem belongs to one Wishlist
      WishlistItem.belongsTo(models.Wishlist, {
        foreignKey: 'wishlist_id',
        as: 'wishlist'
      });
      // A WishlistItem belongs to one Product
      WishlistItem.belongsTo(models.Product, {
        foreignKey: 'product_id',
        as: 'product'
      });
    }
  }
  WishlistItem.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    wishlistId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'wishlist_id'
    },
    productId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'product_id'
    }
  }, {
    sequelize,
    modelName: 'WishlistItem',
    tableName: 'wishlist_items',
    timestamps: false // No createdAt or updatedAt for this simple mapping table
  });
  return WishlistItem;
};