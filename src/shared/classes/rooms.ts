export class Rooms {
    private id: string;
    private name: string;
    private isAvailable: boolean;
    private institutionId: string;
    constructor(id: string, name: string, isAvailable: boolean, institutionId: string) {
        this.id = id;
        this.name = name;
        this.isAvailable = isAvailable;
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

    setIsAvailable(isAvailable: boolean) {
        this.isAvailable = isAvailable;
    }

    getIsAvailable() {
        return this.isAvailable;
    }

    setInstitutionId(institutionId: string) {
        this.institutionId = institutionId;
    }

    getInstitutionId() {
        return this.institutionId;
    }

}