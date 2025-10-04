"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Product extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Product.belongsTo(models.SubCategory, {
        foreignKey: "sub_category_id",
        as: "subCategory",
      });

      // A Product can have many Specs
      Product.hasMany(models.Spec, {
        foreignKey: "product_id",
        as: "specs",
      });

      Product.hasMany(models.OrderItem, {
        foreignKey: "product_id",
        as: "orderItems",
      });

      // A Product can be in many CartItems
      Product.hasMany(models.CartItem, {
        foreignKey: "product_id",
        as: "cartItems",
      });

      // A Product can be in many WishlistItems
      Product.hasMany(models.WishlistItem, {
        foreignKey: "product_id",
        as: "wishlistItems",
      });

      // A Product can have many Variants
      Product.hasMany(models.ProductVariant, {
        foreignKey: "product_id",
        as: "variants",
      });

      Product.hasMany(models.Rating, {
        foreignKey: "product_id",
        as: "ratings",
      });
    }
  }
  Product.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
      },
      mrp: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      images: {
        type: DataTypes.ARRAY(DataTypes.TEXT),
      },
      sku: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      subCategoryId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "sub_category_id",
      },
    },
    {
      sequelize,
      modelName: "Product",
      tableName: "products",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Product;
};
