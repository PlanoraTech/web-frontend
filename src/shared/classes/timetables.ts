import { Institutions } from "./institutions";
import { Appointments } from "./appointments";

export class Timetables {
    private id: string;
    private name: string;
    private appointments?: Appointments[];
    private institution: Institutions;
    private institutionId: string;
    private version: string;

    constructor(id: string, name: string, institution: Institutions, institutionId: string, version: string) {
        this.id = id;
        this.name = name;
        this.institution = institution;
        this.institutionId = institutionId;
        this.version = version;
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

    setAppointments(appointments: Appointments[]) {
        this.appointments = appointments;
    }

    getAppointments() {
        return this.appointments;
    }

    setInstitution(institution: Institutions) {
        this.institution = institution;
    }

    getInstitution() {
        return this.institution;
    }

    setInstitutionId(institutionId: string) {
        this.institutionId = institutionId;
    }

    getInstitutionId() {
        return this.institutionId;
    }

    getVersion() {
        return this.version;
    }

    setVersion(version: string) {
        this.version = version;
    }
}