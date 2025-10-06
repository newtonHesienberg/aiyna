'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('@/app/config/config.js').connectToPostgresDb();

class ThemeSection extends Model {
  static associate(models) {
    this.belongsToMany(models.SubCategory, {
      through: 'theme_section_categories',
      foreignKey: 'theme_section_id',
      otherKey: 'sub_category_id',
      as: 'subCategories',
    });
  }
}

ThemeSection.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false, unique: true },
  title: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  imageUrl: { type: DataTypes.TEXT, field: 'image_url' },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
}, {
  sequelize,
  modelName: 'ThemeSection',
  tableName: 'theme_sections',
  timestamps: false,
});

module.exports = ThemeSection;
