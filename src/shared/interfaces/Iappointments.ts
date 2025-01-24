import { IPresentators } from "./Ipresentators";
import { IRooms } from "./Irooms";
import { ITimetables } from "./Itimetables";

export interface IAppointments {
    id: string;
    subject?: string;
    subjectId?: string;
    presentators: IPresentators[];
    rooms: IRooms[];
    dayofweek: string;
    start: Date;
    end: Date;
    isCancelled: boolean;
    timetables: ITimetables[];
}