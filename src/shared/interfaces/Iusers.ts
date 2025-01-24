import { IInstitutions } from "./Iinstitutions";
import { ITokens } from "./Itokens";

export interface IUsers {
    id: string;
    email: string;
    password: string;
    role: string;
    institutions: IInstitutions[];
    tokens: ITokens[];
}
