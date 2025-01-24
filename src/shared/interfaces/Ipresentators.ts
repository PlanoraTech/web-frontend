import { IAppointments } from "./Iappointments";
import { IInstitutions } from "./Iinstitutions";

export interface IPresentators {
    id: string;
    name: string;
    appointments: IAppointments[];
    institution: IInstitutions;
    institutionId: string;
}