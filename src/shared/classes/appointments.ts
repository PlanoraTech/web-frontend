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
    constructor(id: string, subject: Subjects, presentators: Presentators[], rooms: Rooms[], start: Date, end: Date, isCancelled: boolean) {
        this.id = id;
        this.subject = subject;
        this.presentators = presentators;
        this.rooms = rooms;
        this.start = start;
        this.end = end;
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

    setStart(start: Date) {
        this.start = start;
    }

    getStart() {
        return new Date(this.start)
    }

    setEnd(end: Date) {
        this.end = end;
    }

    getEnd() {
        return new Date(this.end);
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