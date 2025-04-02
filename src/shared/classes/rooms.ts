import { Appointments } from "./appointments";

export class Rooms {
    private id: string;
    private name: string;
    private isAvailable: boolean;
    private appointments?: Appointments[];
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

    getAppointments() {
        return this.appointments;
    }

    setAppointments(appointments: Appointments[]) {
        this.appointments = appointments;
    }

    setInstitutionId(institutionId: string) {
        this.institutionId = institutionId;
    }

    getInstitutionId() {
        return this.institutionId;
    }

}