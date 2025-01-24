import { IAppointments } from "./Iappointments";
import { IInstitutions } from "./Iinstitutions";

export interface IRooms {
    id: string;
    name: string;
    isAvailable: boolean;
    appointments: IAppointments[];
    institution: IInstitutions;
    institutionId: string;
}