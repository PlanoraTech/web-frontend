import { Tokens } from './tokens';

export class Admins {
    id: string;
    email: string;
    password: string;
    tokens: Tokens[];
    constructor(id: string, email: string, password: string, tokens: Tokens[]) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.tokens = tokens;
    }
}