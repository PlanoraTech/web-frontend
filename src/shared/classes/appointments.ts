import { Presentators } from './presentators';
import { Rooms } from './rooms';
import { Subjects } from './subjects';

export class Appointments {
    private id: string;
    private subject?: Subjects;
    private presentators?: Presentators[];
    private rooms?: Rooms[];
    private start: Date;
    private end: Date;
    private isCancelled: boolean;
    private institutionId?: string;
    private origin?: string;
    constructor(id: string, subject: Subjects, presentators: Presentators[], rooms: Rooms[], start: string | Date, end: string | Date, isCancelled: boolean) {
        this.id = id;
        this.subject = subject;
        this.presentators = presentators;
        this.rooms = rooms;
        if (typeof start === 'string') {
            this.start = new Date((new Date(start)).getTime() + (new Date(start)).getTimezoneOffset() * 60000);
        } else {
            this.start = start;
        }
        if (typeof end === 'string') {
            this.end = new Date((new Date(end)).getTime() + (new Date(end)).getTimezoneOffset() * 60000);
        } else {
            this.end = end;
        }
        this.isCancelled = isCancelled;
    }

    setId(id: string) {
        this.id = id;
    }

    getId() {
        return this.id;
    }

    setSubject(subject: Subjects) {
        this.subject = subject;
    }

    getSubject() {
        return this.subject;
    }

    setPresentators(presentators: Presentators[]) {
        this.presentators = presentators;
    }

    getPresentators() {
        return this.presentators;
    }

    setRooms(rooms: Rooms[]) {
        this.rooms = rooms;
    }

    getRooms() {
        return this.rooms;
    }

    setStart(start: string | Date) {
        if (typeof start === 'string') {
            this.start = new Date(start);
        } else {
            this.start = start;
        }
    }

    getStart() {
        return this.start;
    }

    setEnd(end: string | Date) {
        if (typeof end === 'string') {
            this.end = new Date(end);
        } else {
            this.end = end;
        }
    }

    getEnd() {
        return this.end;
    }

    setIsCancelled(isCancelled: boolean) {
        this.isCancelled = isCancelled;
    }

    getIsCancelled() {
        return this.isCancelled;
    }

    setInstitutionId(institutionId: string) {
        this.institutionId = institutionId;
    }

    getInstitutionId() {
        return this.institutionId;
    }

    setOrigin(origin: string) {
        this.origin = origin;
    }

    getOrigin() {
        return this.origin;
    }
}