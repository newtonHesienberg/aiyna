'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('theme_sections', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal('gen_random_uuid()'),
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      title: {
        type: Sequelize.STRING,
        allowNull: true
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      image_url: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    });

    await queryInterface.createTable('theme_section_categories', {
      theme_section_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'theme_sections',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      sub_category_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'sub_categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      // Set the composite primary key
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });
    
    // Add a composite primary key to the junction table
    await queryInterface.addConstraint('theme_section_categories', {
        fields: ['theme_section_id', 'sub_category_id'],
        type: 'primary key',
        name: 'theme_section_categories_pkey'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('theme_section_categories');
    await queryInterface.dropTable('theme_sections');
  }
};