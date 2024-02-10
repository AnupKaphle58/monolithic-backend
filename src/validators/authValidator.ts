import Joi from 'joi';
import {emailSchema, phoneSchema, positiveIntegerSchema, stringSchema } from './schemas';

const signUp = Joi.object({
  name: stringSchema.label('Name').required(),
  email: emailSchema.label('E-mail').required().trim(),
  password: stringSchema.label('Password').required(),
});

const authMe = Joi.object({
  name: stringSchema.label('Name').optional().allow('', null),
  profileId: positiveIntegerSchema.label('Profile Id').optional().allow(null)
});

const forgotPassword = Joi.object({
  email: emailSchema.label('Email'),
});

const confirmSignUp = Joi.object({
  email: emailSchema.label('Email'),
  token: stringSchema.label('Token').length(6),
  type: stringSchema.label('Type')
});

const resendConfirmationCode = Joi.object({
  email: emailSchema.label('Email'),
})

const changePassword = Joi.object({
  previousPassword: stringSchema.label('Previous Password').required(),
  proposedPassword: stringSchema.label('Proposed Password').required(),
});

const logIn = Joi.object({
  email: emailSchema.label('E-mail').required().trim(),
  password: stringSchema.label('Password').required(),
});


export {
  authMe,
  changePassword,
  forgotPassword,
  confirmSignUp,
  logIn,
  signUp,
};
