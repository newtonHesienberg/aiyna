'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Wishlist extends Model {
    static associate(models) {
      // A Wishlist belongs to one User
      Wishlist.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user'
      });
      // A Wishlist has many WishlistItems
      Wishlist.hasMany(models.WishlistItem, {
        foreignKey: 'wishlist_id',
        as: 'items'
      });
    }
  }
  Wishlist.init({
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
    modelName: 'Wishlist',
    tableName: 'wishlists',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return Wishlist;
};