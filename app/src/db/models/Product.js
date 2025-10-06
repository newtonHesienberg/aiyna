'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('@/app/config/config.js').connectToPostgresDb();

class Product extends Model {
  static associate(models) {
    this.belongsTo(models.SubCategory, { foreignKey: 'sub_category_id', as: 'subCategory' });
    this.hasMany(models.Spec, { foreignKey: 'product_id', as: 'specs' });
    this.hasMany(models.OrderItem, { foreignKey: 'product_id', as: 'orderItems' });
    this.hasMany(models.CartItem, { foreignKey: 'product_id', as: 'cartItems' });
    this.hasMany(models.WishlistItem, { foreignKey: 'product_id', as: 'wishlistItems' });
    this.hasMany(models.ProductVariant, { foreignKey: 'product_id', as: 'variants' });
    this.hasMany(models.Rating, { foreignKey: 'product_id', as: 'ratings' });
  }
}

Product.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT },
  mrp: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  images: { type: DataTypes.ARRAY(DataTypes.TEXT) },
  sku: { type: DataTypes.STRING, allowNull: false, unique: true },
  subCategoryId: { type: DataTypes.UUID, allowNull: false, field: 'sub_category_id' },
}, {
  sequelize,
  modelName: 'Product',
  tableName: 'products',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Product;
