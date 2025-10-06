'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('@/app/config/config.js').connectToPostgresDb();

class Spec extends Model {
  static associate(models) {
    this.belongsTo(models.Product, { foreignKey: 'product_id', as: 'product' });
  }
}

Spec.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  productId: { type: DataTypes.UUID, allowNull: false, field: 'product_id' },
  key: { type: DataTypes.STRING, allowNull: false },
  value: { type: DataTypes.STRING, allowNull: false },
}, {
  sequelize,
  modelName: 'Spec',
  tableName: 'specs',
  timestamps: false,
});

module.exports = Spec;
