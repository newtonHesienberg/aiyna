'use strict';
const { Model, DataTypes } = require('sequelize');
const sequelize = require('@/app/config/config.js').connectToPostgresDb();

class User extends Model {
  static associate(models) {
    this.hasMany(models.Address, { foreignKey: 'user_id', as: 'addresses' });
    this.hasMany(models.Order, { foreignKey: 'user_id', as: 'orders' });
    this.hasOne(models.Cart, { foreignKey: 'user_id', as: 'cart' });
    this.hasOne(models.Wishlist, { foreignKey: 'user_id', as: 'wishlist' });
    this.hasMany(models.Feedback, { foreignKey: 'user_id', as: 'feedback' });
    this.hasMany(models.Rating, { foreignKey: 'user_id', as: 'ratings' });
  }
}

User.init({
  id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
  firstName: { type: DataTypes.STRING, allowNull: false, field: 'first_name' },
  lastName: { type: DataTypes.STRING, allowNull: false, field: 'last_name' },
  email: { type: DataTypes.STRING, allowNull: false, unique: true, validate: { isEmail: true } },
  mobile: { type: DataTypes.STRING, allowNull: true, unique: true },
  profileImage: { type: DataTypes.STRING, allowNull: true, field: 'profile_image' },
  emailVerified: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, field: 'email_verified' },
  dob: { type: DataTypes.DATEONLY, allowNull: true },
  gender: { type: DataTypes.ENUM('Male', 'Female', 'Other'), allowNull: true },
}, {
  sequelize,
  modelName: 'User',
  tableName: 'users',
  timestamps: true,
  underscored: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = User;
