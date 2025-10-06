'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class SubCategory extends Model {
    static associate(models) {
      // A SubCategory belongs to one Category
      SubCategory.belongsTo(models.Category, {
        foreignKey: 'category_id',
        as: 'category'
      });

      // --- ADD THIS ASSOCIATION ---
      // A SubCategory can belong to many ThemeSections
      SubCategory.belongsToMany(models.ThemeSection, {
        through: 'theme_section_categories', // This is the name of our junction table
        foreignKey: 'sub_category_id',
        otherKey: 'theme_section_id',
        as: 'themeSections'
      });
      
      // A SubCategory can have many Products
      SubCategory.hasMany(models.Product, {
        foreignKey: 'sub_category_id',
        as: 'products'
      });
    }
  }
  SubCategory.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    categoryId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: 'category_id'
    }
  }, {
    sequelize,
    modelName: 'SubCategory',
    tableName: 'sub_categories',
    timestamps: true,
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });
  return SubCategory;
};