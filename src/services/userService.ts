import * as Boom from '@hapi/boom';
import { WhereOptions } from "sequelize";

import { InputUserInterface, UserInterface } from "@src/interfaces";
import { UserRepository } from "@src/repositories";


export class UserService {
    private repository: UserRepository;
  
    constructor() {
      this.repository = new UserRepository();
    }

    async create(input: InputUserInterface): Promise<UserInterface> {
        if (input.email) {
          const emailExists = await this.repository.findOne({
            where: { email: input.email.trim() },
          });
          if (emailExists) {
            throw Boom.badRequest(`Email exists`, [
              {
                  name: "EmailExistsException",
                  path: ["createUser"],
              },
          ]);
          }
        }
    
        if (input.phoneNumber) {
          const phoneNumberExists = await this.repository.findOne({
            where: { phoneNumber: input.phoneNumber },
          });
          if (phoneNumberExists) throw new Error(`Phone number ${input.phoneNumber} already exists!`);
        }
        return this.repository.create(input);
      }

      findOne({
        email,
        phoneNumber,
        sub,
        phoneNumberVerified,
      }: {
        email?: string;
        phoneNumber?: string;
        sub?: string;
        workspaceId?: number | undefined;
        phoneNumberVerified?: boolean;
      }): Promise<UserInterface> {
        let where: WhereOptions<any> = {};
        if (sub) {
          where = { ...where, sub: sub };
        }
    
        if (email) {
          where = { ...where, email: email };
        }
    
        if (phoneNumber) {
          where = { ...where, phoneNumber: phoneNumber };
        }
    
        if (phoneNumberVerified === true || phoneNumberVerified === false) {
          where = { ...where, phoneNumberVerified };
        }
    
        return this.repository.findOne({
          where,
        });
      }

      async findByPk(id: number): Promise<UserInterface> {   
        let workspaceWhere: WhereOptions<any> = {};

        const userExists = await this.repository.findByPk(id, {
          include: [
            // {
            //   model: Model.Workspace,
            //   as: 'workspaces',
            //   attributes: ["id", "label"],
            //   ...(Object.keys(workspaceWhere).length > 0 && { where: workspaceWhere }),
            // },
          ],
        });
        if (!userExists) throw new Error(`User: ${id} does not exist!`);
        return userExists;
      }
}