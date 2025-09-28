'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ThemeSection extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      ThemeSection.belongsToMany(models.SubCategory, {
        through: 'theme_section_categories', // This is the name of our junction table
        foreignKey: 'theme_section_id',
        otherKey: 'sub_category_id',
        as: 'subCategories'
      });
    }
  }
  ThemeSection.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    imageUrl: {
      type: DataTypes.TEXT,
      field: 'image_url'
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
    }
  }, {
    sequelize,
    modelName: 'ThemeSection',
    tableName: 'theme_sections',
    timestamps: false // No createdAt or updatedAt columns in this table
  });
  return ThemeSection;
};