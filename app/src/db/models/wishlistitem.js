'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('@/app/config/config.js').connectToPostgresDb();

class WishlistItem extends Model {
  static associate(models) {
    this.belongsTo(models.Wishlist, { foreignKey: 'wishlist_id', as: 'wishlist' });
    this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  }
}

WishlistItem.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  wishlistId: { type: DataTypes.UUID, allowNull: false, field: 'wishlist_id' },
  productId: { type: DataTypes.UUID, allowNull: false, field: 'product_id' },
}, {
  sequelize,
  modelName: 'WishlistItem',
  tableName: 'wishlist_items',
  timestamps: false,
});

module.exports = WishlistItem;
