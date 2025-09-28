'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Products', {
      product_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      sku: { type: Sequelize.STRING, unique: true },
      name: { type: Sequelize.STRING, allowNull: false },
      description: Sequelize.TEXT,
      category: Sequelize.STRING,
      base_price: { type: Sequelize.DECIMAL(10, 2), allowNull: false },
      image_url: Sequelize.STRING,
      canvas_image_url: Sequelize.STRING,
      model_url: Sequelize.STRING,
      available_colors: Sequelize.JSON,
      available_sizes: Sequelize.JSON,
      is_active: { type: Sequelize.BOOLEAN, defaultValue: true },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('Products');
  }
};
