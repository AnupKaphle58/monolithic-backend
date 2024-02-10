import * as Boom from '@hapi/boom';

import { UserService } from '@src/services';
import { Validator } from '@src/middlewares';
import { SupabaseAuth } from "@src/utils/supabaseAuth";
import { logIn, signUp, confirmSignUp } from '@src/validators';
import { NextFunction, Request, Response } from "express";
import { UserConfirmationEnum } from '@src/enums';
import { Helper } from '@src/Helper';

export class AuthController {
    public constructor() { }

    public static async signUp(req: Request, res: Response): Promise<Response> {
        Validator.check(signUp, req.body);
        let user;
        try {
            user = await SupabaseAuth.signUp(req.body);
            await Helper.createUser({
                sub: user.data.user?.id!,
                email: user.data.user?.email!,
                name: req.body.name,
                phoneNumber: req.body.phoneNumber ?? null,
                active: true,
                confirmationStatus: UserConfirmationEnum.UNCONFIRMED,
                meta: user.data.user?.app_metadata
            })
        } catch (error: any) {
            console.log(error.data)
            if (error.name === 'SequelizeValidationError' && error.data[0].name === 'EmailExistsException') {
                const user = await new UserService().findOne({ email: req.body.email })
                const { data, error } = await SupabaseAuth.adminGetUser(user.sub!)
                if (data.user?.user_metadata.userStatus === UserConfirmationEnum.UNCONFIRMED) {
                    await SupabaseAuth.resendSignupOtp(data.user.email!);
                    return res.status(200).json({
                        message: "User registered successfully",
                        data: { email: data.user.email }
                    });
                }
            }
            throw Boom.badRequest(`You have already signed up. Please login to continue`, [
                {
                    name: "ExistingUser",
                    path: ["Signup"],
                },
            ]);
        }

        return res.status(200).json({
            message: "User registered successfully.",
            data: user.data.user
        });
    }

    public static async confirmSignUp(req: Request, res: Response): Promise<Response> {
        Validator.check(confirmSignUp, req.body);

        const emailExists = await new UserService().findOne(req.body)
        if (!emailExists) {
            throw Boom.badRequest(`The email you entered isn’t connected to an account.`, [
                {
                    name: "EmailNotFound",
                    path: ["ConfirmSignUp"],
                },
            ]);
        }
        const { error } = await SupabaseAuth.verifyOTP(req.body)
        if (error) {
            throw Boom.badRequest(`${error.message}`, [
                {
                    name: "InvalidToken",
                    path: ["ConfirmSignUp"],
                },
            ]);
        }

        return res.status(200).json({
            message: 'User has been verified.',
        });
    }

    public static async resendConfirmationCode(req: Request, res: Response): Promise<Response> {
        Validator.check(confirmSignUp, req.body);

        const { error } = await SupabaseAuth.resendSignupOtp(req.body)
        if (error) {
            throw Boom.badRequest(`${error.message}`, [
                {
                    name: `${error.name}`,
                    path: ["ResendConfirmationCode"],
                },
            ]);
        }

        return res.status(200).json({
            message: 'Conformation code sent successfully.',
        });
    }

    public static async logIn(req: Request, res: Response): Promise<Response> {
        Validator.check(logIn, req.body);

        const { data, error } = await SupabaseAuth.logIn(req.body);
        const userExists = await new UserService().findOne({ sub: data.user?.id });

        if (!userExists) {
            await Helper.createUser({
                sub: data.user?.id!,
                email: data.user?.email!,
                name: req.body.name,
                phoneNumber: req.body.phoneNumber ?? null,
                active: true,
                confirmationStatus: UserConfirmationEnum.CONFIRMED,
                meta: data.user?.app_metadata
            })
        }

        if (error)
            throw Boom.badRequest(`${error.message}`, [
                {
                    name: `${error.name}`,
                    path: ["login"],
                },
            ]);


        return res.status(200).json({
            message: "Logged In successfully.",
            data: {
                user: data.user,
                token: {
                    access: data.session.access_token,
                    refresh: data.session.refresh_token,
                },
            },
        });
    }

    public static async authMe(req: Request, res: Response): Promise<Response> {
        const jwt = req.headers.authorization!;
        const { data, error } = await SupabaseAuth.getUser(jwt);

        if (error)
            throw Boom.badRequest(`${error.message}`, [
                {
                    name: `${error.name}`,
                    path: ["authMe"],
                },
            ]);

        return res.status(200).json({
            message: "User details fetched successfully.",
            data: data,
        });
    }

    public static async forgotPassword(req: Request, res: Response): Promise<Response> {
        const userExists = await new UserService().findOne({ email: req.body.email });
        if (!userExists) {
            throw Boom.badRequest(`The email you entered isn’t connected to an account.`, [
                {
                    name: `invalidEmail`,
                    path: ["forgotPassword"],
                },
            ]);
        }
        const { error } = await SupabaseAuth.resetPassword(req.body.email);
        
        if (error) {
            throw Boom.badRequest(`${error.message}`, [
                {
                    name: `${error.name}`,
                    path: ["forgotPassword"],
                },
            ]);
        }

        return res.status(200).json({
            message: "Forgot password successfully",
        });
    }
}