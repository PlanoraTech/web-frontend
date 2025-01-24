import { Institutions } from './institutions';
import { Tokens } from './tokens';

export class Users {
    id: string;
    email: string;
    password: string;
    role: string;
    institutions: Institutions[];
    tokens: Tokens[];
    constructor(id: string, email: string, password: string, role: string, institutions: Institutions[], tokens: Tokens[]) {
        this.id = id;
        this.email = email;
        this.password = password;
        this.role = role;
        this.institutions = institutions;
        this.tokens = tokens;
    }
}