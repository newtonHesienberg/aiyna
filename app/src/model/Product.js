'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    static associate(models) {
      Product.hasMany(models.OrderItem, { foreignKey: 'product_id' });
    }
  }

  Product.init(
    {
      product_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      sku: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
      },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      category: DataTypes.STRING,
      base_price: DataTypes.DECIMAL,
      image_url: DataTypes.STRING,
      canvas_image_url: DataTypes.STRING,
      model_url: DataTypes.STRING,
      available_colors: DataTypes.JSON,
      available_sizes: DataTypes.JSON,
      is_active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: 'Product',
      tableName: 'Products',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return Product;
};
