
export class Presentators {
    private id: string;
    private name: string;
    private institutionId: string;

    constructor(id: string, name: string, institutionId: string) {
        this.id = id;
        this.name = name;
        this.institutionId = institutionId;
    }

    setId(id: string) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    setName(name: string) {
        this.name = name;
    }

    getName() {
        return this.name;
    }

    setInstitutionId(institutionId: string) {
        this.institutionId = institutionId;
    }

    getInstitutionId() {
        return this.institutionId;
    }
}