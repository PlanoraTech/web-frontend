import { Users } from "./users";
import { Admins } from "./admins";

export class Tokens {
    id: string;
    token: string;
    user?: Users;
    userId?: string;
    admin?: Admins;
    adminId?: string;
    constructor(id: string, token: string, user: Users, userId: string, admin: Admins, adminId: string) {
        this.id = id;
        this.token = token;
        this.user = user;
        this.userId = userId;
        this.admin = admin;
        this.adminId = adminId;

    }
}