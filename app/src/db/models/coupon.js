'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('@/app/config/config.js').connectToPostgresDb();

class Coupon extends Model {
  static associate(models) {
    // Associations can be defined here if needed in the future
  }
}

Coupon.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  code: { type: DataTypes.STRING, allowNull: false, unique: true },
  discount: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
  isActive: { type: DataTypes.BOOLEAN, defaultValue: true, field: 'is_active' },
  expiresAt: { type: DataTypes.DATE, field: 'expires_at' },
  minSpend: { type: DataTypes.DECIMAL(10, 2), field: 'min_spend' },
  targetCategories: { type: DataTypes.ARRAY(DataTypes.STRING), field: 'target_categories' },
}, {
  sequelize,
  modelName: 'Coupon',
  tableName: 'coupons',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Coupon;
