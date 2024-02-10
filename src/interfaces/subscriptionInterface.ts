import * as Sequelize from 'sequelize';
import { ModelTimestampExtend } from '.';
import { BillingIntervalEnum } from '@src/enums';

export interface InputSubscriptionInterface {
    userId: number,
    active: boolean,
    currentPeriodEnd: string,
    currentPeriodStart: string,
    dueSince?: string,
    billingInterval: BillingIntervalEnum,
    nextBillingDate: string,
    log: JSON
}

export interface SubscriptionInterface extends ModelTimestampExtend {
    id: Sequelize.CreationOptional<number>;
    userId: number,
    active: boolean,
    currentPeriodEnd: string,
    currentPeriodStart: string,
    dueSince?: string,
    billingInterval: BillingIntervalEnum,
    nextBillingDate: string,
    log: JSON
}

export interface SubscriptionModelInterface
    extends Sequelize.Model<SubscriptionInterface, Partial<InputSubscriptionInterface>>,
    SubscriptionInterface { }