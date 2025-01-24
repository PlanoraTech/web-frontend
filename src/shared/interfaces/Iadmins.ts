import { ITokens } from "./Itokens";

export interface IAdmins {
    id: string;
    email: string;
    password: string;
    tokens: ITokens[];
}