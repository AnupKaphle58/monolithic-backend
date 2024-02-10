import * as Sequelize from 'sequelize';

import { Database } from '../config/instance';
import { UserConfirmationEnum } from '../enums';
import { UserModelInterface } from '../interfaces';

const sequelize = Database.sequelize;

const User = sequelize.define<UserModelInterface>(
  'users',
  {
    id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: Sequelize.STRING,
    },
    sub: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      validate: {
        isEmail: true,
      },
    },
    emailVerified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'email_verified',
    },
    phoneNumber: {
      type: Sequelize.STRING,
      field: 'phone_number',
    },
    phoneNumberVerified: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
      field: 'phone_number_verified',
    },
    confirmationStatus: {
      type: Sequelize.ENUM(
        UserConfirmationEnum.UNCONFIRMED,
        UserConfirmationEnum.CONFIRMED,
        UserConfirmationEnum.ARCHIVED,
        UserConfirmationEnum.COMPROMISED,
        UserConfirmationEnum.UNKNOWN,
        UserConfirmationEnum.RESET_REQUIRED,
        UserConfirmationEnum.FORCE_CHANGE_PASSWORD,
      ),
      allowNull: false,
      defaultValue: UserConfirmationEnum.UNCONFIRMED,
      field: 'confirmation_status',
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    meta: {
      type: Sequelize.JSONB,
    },
    // profileId: {
    //   type: Sequelize.INTEGER,
    //   references: {
    //     model: Media,
    //     key: 'id'
    //   },
    //   field: 'profile_id'
    // },
  },
  {
    timestamps: true,
    paranoid: true,
    underscored: true,
    indexes: [
      {
        unique: true,
        name: 'users_email',
        fields: ['email'],
        where: {
          deletedAt: null,
        },
      },
    ],
  },
);


// User.belongsTo(Media, {
//   foreignKey: "profileId",
//   as: "profilePicture"
// })

export default User;
