'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      user_id: {
        type: Sequelize.UUID,
        primaryKey: true,
        defaultValue: Sequelize.literal('gen_random_uuid()')
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      mobile: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password_hash: {
        type: Sequelize.STRING,
        allowNull: false
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      address: {
        type: Sequelize.JSON,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    });

    await queryInterface.addIndex('users', ['mobile'], {
      unique: true,
      name: 'users_mobile_idx'
    });

    await queryInterface.addIndex('users', ['email'], {
      unique: true,
      name: 'users_email_idx'
    });
  },

  async down(queryInterface) {
    await queryInterface.removeIndex('users', 'users_mobile_idx');
    await queryInterface.removeIndex('users', 'users_email_idx');
    await queryInterface.dropTable('users');
  }
};
