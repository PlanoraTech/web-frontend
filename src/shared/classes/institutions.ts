import { Presentators } from './presentators';
import { Subjects } from './subjects';
import { Rooms } from './rooms';
import { Timetables } from './timetables';
import { Users } from './users';
import { Events } from './events';

export class Institutions {
    private id: string;
    private name: string;
    private type: string;
    private access: string;
    private color: string;
    private website: string;
    private presentators?: Presentators[];
    private subjects?: Subjects[];
    private rooms?: Rooms[];
    private timetables?: Timetables[];
    private events?: Events[];
    private users?: Users[];

    constructor(id: string, name: string, type: string, access: string, color: string, website: string) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.access = access;
        this.color = color;
        this.website = website;
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

    setType(type: string) {
        this.type = type;
    }

    getType() {
        return this.type;
    }

    setAccess(access: string) {
        this.access = access;
    }

    getAccess() {
        return this.access;
    }

    setColor(color: string) {
        this.color = color;
    }

    getColor() {
        return this.color;
    }

    setWebsite(website: string) {
        this.website = website;
    }

    getWebsite() {
        return this.website;
    }

    setPresentators(presentators: Presentators[]) {
        this.presentators = presentators;
    }

    getPresentators() {
        return this.presentators;
    }

    setSubjects(subjects: Subjects[]) {
        this.subjects = subjects;
    }

    getSubjects() {
        return this.subjects;
    }

    setRooms(rooms: Rooms[]) {
        this.rooms = rooms;
    }

    getRooms() {
        return this.rooms;
    }

    setTimetables(timetables: Timetables[]) {
        this.timetables = timetables;
    }

    getTimetables() {
        return this.timetables;
    }

    setEvents(events: Events[]) {
        this.events = events;
    }

    getEvents() {
        return this.events;
    }

    setUsers(users: Users[]) {
        this.users = users;
    }

    getUsers() {
        return this.users;
    }
}