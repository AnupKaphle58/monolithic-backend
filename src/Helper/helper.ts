import { RoleEnum } from "@src/enums";
import { InputUserInterface, UserInterface } from "@src/interfaces";
import { UserService } from "@src/services";



class Helper {
    static instance: Helper;
    constructor() { }

    static get(): Helper {
        if (!Helper.instance) {
            Helper.instance = new Helper();
        }
        return Helper.instance;
    }

    async createUser(input: InputUserInterface): Promise<UserInterface> {
        const user = await new UserService().create({
            sub: input.sub,
            name: input.name,
            email: input.email,
            phoneNumber: input.phoneNumber,
            active: true,
            confirmationStatus: input.confirmationStatus,
        });

        // await new WorkspaceService().create({
        //   label: input.name!,
        //   ownerId: user.id,
        // });

        return new UserService().findByPk(user.id);
    }
}  

const helper = Helper.get();

export { helper as Helper };