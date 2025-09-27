'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      Order.belongsTo(models.User, { foreignKey: 'user_id' });
      Order.hasMany(models.OrderItem, { foreignKey: 'order_id' });
    }
  }

  Order.init(
    {
      order_id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
      },
      order_date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      total_amount: DataTypes.DECIMAL,
      status: {
        type: DataTypes.STRING,
        defaultValue: 'pending_fulfillment',
      },
      shipping_address: DataTypes.JSON,
      payment_id: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'Order',
      tableName: 'Orders',
      timestamps: false,
    }
  );

  return Order;
};
