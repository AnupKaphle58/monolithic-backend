/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */

'use strict';

const { DataTypes } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('subscriptions', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
      },
      active: {
        type: DataTypes.BOOLEAN,
        allowNull: false
      },
      billing_interval: {
        type: DataTypes.ENUM(["MONTHLY", "YEARLY"]),
        allowNull: false,
      },
      current_period_start: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      current_period_end: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      due_since: {
        type: Sequelize.DATE,
      },
      next_billing_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      log: {
        type: Sequelize.JSONB,
        allowNull: true,
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

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('subscriptions');
  },
};
