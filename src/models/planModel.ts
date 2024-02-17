import * as Sequelize from 'sequelize';

import { Database } from '../config/instance';
import { BillingIntervalEnum } from '../enums';
import { PlanModelInterface } from '../interfaces';
import User from './user';

const sequelize = Database.sequelize;

const PlanModel = sequelize.define<PlanModelInterface>(
    'plan',
    {
        id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        label: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        slug: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: false,
        },
        active: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        features: {
            type: Sequelize.JSONB,
            allowNull: false,
        },
        price: {
            type: Sequelize.DECIMAL(10, 2),
        },
        occurance: {
            type: Sequelize.ENUM(
                BillingIntervalEnum.MONTHLY,
                BillingIntervalEnum.YEARLY
            ),
            allowNull: false,
        },
    }
);

export default PlanModel;
