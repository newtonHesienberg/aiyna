'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('@/app/config/config.js').connectToPostgresDb();

class Address extends Model {
  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
    this.hasMany(models.Order, { foreignKey: 'address_id', as: 'orders' });
  }
}

Address.init({
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true, allowNull: false },
  userId: { type: DataTypes.STRING, allowNull: false, field: 'user_id' },
  name: { type: DataTypes.STRING, allowNull: false },
  street: { type: DataTypes.TEXT, allowNull: false },
  city: { type: DataTypes.STRING, allowNull: false },
  state: { type: DataTypes.STRING, allowNull: false },
  zipCode: { type: DataTypes.STRING, allowNull: false, field: 'zip_code' },
  country: { type: DataTypes.STRING, allowNull: false },
  phone: { type: DataTypes.STRING },
}, {
  sequelize,
  modelName: 'Address',
  tableName: 'addresses',
  timestamps: false,
});

module.exports = Address;
