import { IGroups } from "./Igroups";
import { IPresentators } from "./Ipresentators";
import { IRooms } from "./Irooms";
import { ISubjects } from "./Isubjects";
import { ITimetables } from "./Itimetables";
import { IUsers } from "./Iusers";


export interface IInstitutions {
    id: string;
    name: string;
    type: string;
    access: string;
    color: string;
    website: string;
    groups: IGroups[];
    presentators: IPresentators[];
    subjects: ISubjects[];
    rooms: IRooms[];
    timetables: ITimetables[];
    users: IUsers[];
}