export class Events {
    private id: string;
    private title: string;
    private date: Date;

    constructor(id: string, title: string, date: Date) {
        this.id = id;
        this.title = title;
        this.date = date;
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
}