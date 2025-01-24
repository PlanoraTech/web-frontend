import { IAppointments } from "./Iappointments";
import { IInstitutions } from "./Iinstitutions";

export interface ISubjects {
    id: string;
    name: string;
    subjectId: string;
    appointments: IAppointments[];
    institution: IInstitutions;
    institutionId: string;
}