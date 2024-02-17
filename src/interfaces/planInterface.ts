import * as Sequelize from 'sequelize';
import { ModelTimestampExtend } from '.';
import { BillingIntervalEnum } from '@src/enums';

export interface InputPlanInterface {
    label: string,
    active: boolean,
    slug: string,
    description: string,
    features: object,
    price: number,
    occurance: BillingIntervalEnum,
}

export interface PlanInterface extends ModelTimestampExtend {
    id: Sequelize.CreationOptional<number>,
    label: string,
    active: boolean,
    slug: string,
    description: string,
    features: object,
    price: number,
    occurance: BillingIntervalEnum
}

export interface PlanModelInterface
    extends Sequelize.Model<PlanInterface, Partial<InputPlanInterface>>,
    PlanInterface { }