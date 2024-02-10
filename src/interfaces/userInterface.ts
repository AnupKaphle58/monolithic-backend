import * as Sequelize from 'sequelize';
import { ModelTimestampExtend } from '.';

import { RoleEnum, UserConfirmationEnum } from '../enums';

export interface InputUserInterface {
  name: string;
  sub?:string;
  email: string;
  emailVerified?: boolean;
  phoneNumber?: string;
  phoneNumberVerified?: boolean;
  role?: RoleEnum;
  roles?: RoleEnum[];
  confirmationStatus?: UserConfirmationEnum;
  active?: boolean;
  accessToken?: string;
  meta?: object;
}
export interface UserInterface extends ModelTimestampExtend {
  id: Sequelize.CreationOptional<number>;
  name: string;
  sub?:string;
  email: string;
  emailVerified: boolean;
  phoneNumber?: string;
  phoneNumberVerified: boolean;
  confirmationStatus: UserConfirmationEnum;
  active: boolean;
  meta?: object;
  profileId?: number;
}

export interface UserModelInterface
  extends Sequelize.Model<UserInterface, Partial<InputUserInterface>>,
    UserInterface {}
