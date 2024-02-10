import * as Sequelize from 'sequelize';

import { Database } from '../config/instance';
import { BillingIntervalEnum } from '../enums';
import { SubscriptionModelInterface } from '../interfaces';
import User from './user';

const sequelize = Database.sequelize;

const SubscriptionModel = sequelize.define<SubscriptionModelInterface>(
  'subscription',
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    userId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      field: "user_id",
      references: {
        model: "users",
        key: "id",
      },
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    currentPeriodEnd: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'current_period_end',
    },
    currentPeriodStart: {
      type: Sequelize.STRING,
      allowNull: false,
      field: 'current_period_start',
    },
    dueSince: {
      type: Sequelize.DATE,
      field: 'due_since',
    },
    billingInterval: {
      type: Sequelize.ENUM(
        BillingIntervalEnum.MONTHLY,
        BillingIntervalEnum.YEARLY
      ),
      allowNull: false,
      field: 'billing_interval',
    },
    nextBillingDate: {
      type: Sequelize.DATE,
      field: 'next_billing_date',
      allowNull: false
    },
    log: {
      type: Sequelize.JSONB,
    },
  }
);

SubscriptionModel.belongsTo(User, {
  foreignKey: "userId",
  as: "customer"
});

User.hasMany(SubscriptionModel, {
  foreignKey: "customerId",
  as: "subscriptions",
});


export default User;
