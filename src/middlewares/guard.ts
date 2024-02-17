import { NextFunction, Request, Response } from "express";
import Boom from "@hapi/boom";

import { RoleEnum } from "@src/enums";
import {
  UserInterface,
} from "@src/interfaces";
import { UserService } from "@src/services";
import { SupabaseAuth } from '@src/utils/supabaseAuth';

class Guard {
  private static instance: Guard;

  private constructor() {}

  static get(): Guard {
    if (!Guard.instance) {
      Guard.instance = new Guard();
    }
    return Guard.instance;
  }

   auth = async (token: string): Promise<UserInterface | undefined> => {
    try {
      const verify = await SupabaseAuth.getUser(token);
      const userExists = await new UserService().findOne({
        sub: verify.data.user!.id,
      });
      if (!userExists) {
        throw Boom.unauthorized(`Auth Failed`, token, {
          message: `Token is invalid or user doesn't exits `,
          path: "authorization",
        });
      }
      if (!userExists.emailVerified || !userExists.phoneNumberVerified) {
        // return this.verifyUser(userExists.id, token);
      }
      return userExists;
    } catch (error: any) {
      if (error.failedAssertion) {
        return undefined;
      } else {
        throw Boom.unauthorized(`Auth Failed`, token, {
          message: `Auth failed `,
          path: "authorization",
        });
      }
    }
  };

  grant = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers.authorization as string;
    if (!token) {
      throw Boom.unauthorized("Auth Failed", token, {
        message: "Auth failed",
        path: "authorization",
      });
    }
    const user = await this.auth(token.replace("Bearer ", ""));
    if (!user) {
      throw Boom.unauthorized(`Auth Failed`, token, {
        message: `Auth Failed`,
        path: "authorization",
      });
    }
    req.headers.user = user as any;
    next();
  };
}

const guard = Guard.get();

export { guard as Guard };
