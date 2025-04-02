import { Institutions } from './institutions';
import { Tokens } from './tokens';

export class Users {
    private id?: string;
    private email: string;
    private password?: string;
    private role: string;
    private institutions?: Institutions[];
    private presentatorId?: string;
    private tokens?: Tokens;

    constructor(email: string, role: string) {
        this.email = email;
        this.role = role;
    }

    getId() {
        return this.id;
    }

    setId(id: string) {
        this.id = id;
    }

    getEmail() {
        return this.email;
    }

    setEmail(email: string) {
        this.email = email;
    }

    getPassword() {
        return this.password;
    }

    setPassword(password: string) {
        this.password = password;
    }

    getRole() {
        return this.role;
    }

    setRole(role: string) {
        this.role = role;
    }

    getInstitutions() {
        return this.institutions;
    }

    setInstitutions(institutions: Institutions[]) {
        this.institutions = institutions;
    }

    getPresentatorId() {
        return this.presentatorId;
    }

    setPresentatorId(presentatorId: string) {
        this.presentatorId = presentatorId;
    }

    getTokens() {
        return this.tokens;
    }

    setTokens(tokens: Tokens) {
        this.tokens = tokens;
    }

}