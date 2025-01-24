
export class Subjects {
    private id: string;
    private name: string;
    private subjectId: string;
    private institutionId: string;
    constructor(id: string, name: string, subjectId: string, institutionId: string) {
        this.id = id;
        this.name = name;
        this.subjectId = subjectId;
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

    setSubjectId(subjectId: string) {
        this.subjectId = subjectId;
    }

    getSubjectId() {
        return this.subjectId;
    }

    setInstitutionId(institutionId: string) {
        this.institutionId = institutionId;
    }

    getInstitutionId() {
        return this.institutionId;
    }

}