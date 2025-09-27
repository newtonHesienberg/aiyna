'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Order_Items', {
      order_item_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      order_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Orders', key: 'order_id' },
        onDelete: 'CASCADE'
      },
      product_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Products', key: 'product_id' }
      },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      price_per_unit: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      selected_color: Sequelize.STRING,
      selected_size: Sequelize.STRING,
      final_design_image: Sequelize.TEXT
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Order_Items');
  }
};
