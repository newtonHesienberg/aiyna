'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Creation extends Model {
    static associate(models) {
      Creation.belongsTo(models.User, { foreignKey: 'user_id' });
    }
  }

  Creation.init(
    {
      creation_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      prompt_text: DataTypes.TEXT,
      design_image_url: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Creation',
      tableName: 'Creations',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: false,
    }
  );

  return Creation;
};
