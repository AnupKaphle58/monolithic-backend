/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      sub: {
        type: DataTypes.STRING,
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          isEmail: true,
        },
      },
      email_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      phone_number: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      phone_number_verified: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      confirmation_status: {
        type: DataTypes.ENUM(["UNCONFIRMED", "CONFIRMED", "ARCHIVED", "COMPROMISED", "UNKNOWN", "RESET_REQUIRED", "FORCE_CHANGE_PASSWORD"]),
        allowNull: false,
        defaultValue: "UNCONFIRMED",
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      meta: {
        type: DataTypes.JSONB,
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

    await queryInterface.addIndex('users', ['email'], {
      concurrently: true,
      unique: true,
      type: 'UNIQUE',
      name: 'users_email',
      where: {
        deleted_at: null,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('users', 'email');
    await queryInterface.dropTable('users');
  },
};
