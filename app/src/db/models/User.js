'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      // Example: User.hasMany(models.Post);
    }
  }

  User.init({
    // 'id' is automatically created by Sequelize as the primary key
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'first_name' // Maps this model attribute to the database column
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'last_name'
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true // Adds a validation check for email format
      }
    },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: true,
      field: 'profile_image'
    },
    emailVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'email_verified'
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    // Automatically manage createdAt and updatedAt fields
    timestamps: true, 
    // Use snake_case for automatically added attributes (createdAt, updatedAt)
    underscored: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  });

  return User;
};