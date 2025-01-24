import { IAppointments } from "./Iappointments";
import { IGroups } from "./Igroups";
import { IInstitutions } from "./Iinstitutions";

export interface ITimetables {
    id: string;
    group: IGroups;
    groupId: string;
    appointments: IAppointments[];
    institution: IInstitutions;
    institutionId: string;
}