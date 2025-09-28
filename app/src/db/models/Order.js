"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    static associate(models) {
      // An Order belongs to one User
      Order.belongsTo(models.User, {
        foreignKey: "user_id",
        as: "user",
      });
      // An Order belongs to one Address
      Order.belongsTo(models.Address, {
        foreignKey: "address_id",
        as: "shippingAddress",
      });
      // An Order has many OrderItems
      Order.hasMany(models.OrderItem, {
        foreignKey: "order_id",
        as: "items",
      });
    }
  }
  Order.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "user_id",
      },
      addressId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: "address_id",
      },
      total: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM(
          "PENDING",
          "PROCESSING",
          "SHIPPED",
          "DELIVERED",
          "CANCELLED"
        ),
        allowNull: false,
        defaultValue: "PENDING",
      },
      isPaid: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        field: "is_paid",
      },
    },
    {
      sequelize,
      modelName: "Order",
      tableName: "orders",
      timestamps: true,
      underscored: true,
      createdAt: "created_at",
      updatedAt: "updated_at",
    }
  );
  return Order;
};
