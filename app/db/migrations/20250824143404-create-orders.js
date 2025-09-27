'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Orders', {
      order_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'Users', key: 'user_id' },
        onDelete: 'CASCADE'
      },
      order_date: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      total_amount: Sequelize.DECIMAL(10, 2),
      status: Sequelize.STRING,
      shipping_address: Sequelize.JSON,
      payment_id: Sequelize.STRING
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Orders');
  }
};
