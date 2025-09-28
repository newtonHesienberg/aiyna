// src/main/model/order_item.js
'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OrderItem extends Model {
    static associate(models) {
      OrderItem.belongsTo(models.Order, { foreignKey: 'order_id' });
      OrderItem.belongsTo(models.Product, { foreignKey: 'product_id' });
    }
  }

  OrderItem.init(
    {
      order_item_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      order_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      product_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },
      price_per_unit: DataTypes.DECIMAL,
      selected_color: DataTypes.STRING,
      selected_size: DataTypes.STRING,
      final_design_image: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: 'OrderItem',
      tableName: 'Order_Items',
      timestamps: false,
    }
  );

  return OrderItem;
};
