import { Institutions } from './institutions';

export class Users {
    private id?: string;
    private email: string;
    private role?: string;
    private institutions?: Institutions[];
    private presentatorId?: string;

    constructor(id: string, email: string) {
        this.id = id;
        this.email = email;
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
}