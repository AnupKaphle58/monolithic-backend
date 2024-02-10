'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('workspaces', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      label: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      secret: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      owner_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
      },
      active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
      },
      status: {
        type: DataTypes.ENUM('pending', 'approved', 'limited', 'reject', 'closed'),
        allowNull: false,
        defaultValue: 'pending',
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      deleted_at: {
        type: DataTypes.DATE,
      },
    });

    await queryInterface.addIndex('workspaces', ['secret'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'secret',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('workspaces', 'secret');
    await queryInterface.dropTable('workspaces');
  },
};
