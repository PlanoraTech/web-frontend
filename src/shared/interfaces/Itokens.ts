import { IAdmins } from "./Iadmins";
import { IUsers } from "./Iusers";

export interface ITokens {
    id: string;
    token: string;
    user?: IUsers;
    userId?: string;
    admin?: IAdmins;
    adminId?: string;
}