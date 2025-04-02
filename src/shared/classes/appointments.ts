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
    constructor(id: string, subject: Subjects, presentators: Presentators[], rooms: Rooms[], start: string, end: string, isCancelled: boolean) {
        this.id = id;
        this.subject = subject;
        this.presentators = presentators;
        this.rooms = rooms;
        let default_start = new Date(start)
        const utcStart = new Date(default_start.getTime() + default_start.getTimezoneOffset() * 60000);
        this.start = utcStart;
        let default_end = new Date(end)
        const utcEnd = new Date(default_end.getTime() + default_end.getTimezoneOffset() * 60000);
        this.end = utcEnd;
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

    setStart(start: string) {
        let default_start = new Date(start)
        const utcStart = new Date(default_start.getTime() + default_start.getTimezoneOffset() * 60000);
        // this.start = utcStart;
        this.start = new Date(start);
    }

    getStart() {
        return this.start;
    }

    setEnd(end: string) {
        let default_end = new Date(end)
        const utcEnd = new Date(default_end.getTime() + default_end.getTimezoneOffset() * 60000);
        // this.end = utcEnd;
        this.end = new Date(end);
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