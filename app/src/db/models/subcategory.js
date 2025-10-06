'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('@/app/config/config.js').connectToPostgresDb();

class SubCategory extends Model {
  static associate(models) {
    this.belongsTo(models.Category, { foreignKey: 'category_id', as: 'category' });
    this.belongsToMany(models.ThemeSection, {
      through: 'theme_section_categories',
      foreignKey: 'sub_category_id',
      otherKey: 'theme_section_id',
      as: 'themeSections',
    });
    this.hasMany(models.Product, {
      foreignKey: 'sub_category_id',
      as: 'products'
    });
  }
}

SubCategory.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  name: { type: DataTypes.STRING, allowNull: false },
  categoryId: { type: DataTypes.UUID, allowNull: false, field: 'category_id' },
}, {
  sequelize,
  modelName: 'SubCategory',
  tableName: 'sub_categories',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = SubCategory;
