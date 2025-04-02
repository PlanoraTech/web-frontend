export class Events {
    private id: string;
    private title: string;
    private date: Date;
    private institutionId: string;

    constructor(id: string, title: string, date: Date, institutionId: string) {
        this.id = id;
        this.title = title;
        this.date = date;
        this.institutionId = institutionId;
    }

    setId(id: string) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    setTitle(title: string) {
        this.title = title;
    }

    getTitle() {
        return this.title;
    }

    setDate(date: Date) {
        this.date = date;
    }

    getDate() {
        return new Date(this.date);
    }

    setInstitutionId(institutionId: string) {
        this.institutionId = institutionId;
    }

    getInstitutionId() {
        return this.institutionId;
    }
}