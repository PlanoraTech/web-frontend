import { Appointments } from "../shared/classes/appointments";
import { Presentators } from "../shared/classes/presentators";
import { Rooms } from "../shared/classes/rooms";
import { Timetables } from "../shared/classes/timetables";

export const setSelectionAndResetAppointments = <T extends { getId: () => string }>(list: T[] | null, id: string, setter: React.Dispatch<React.SetStateAction<T | null>>, setSelectedAppointments: React.Dispatch<React.SetStateAction<Appointments[]>>, setSelectedPresentator?: React.Dispatch<React.SetStateAction<Presentators | null>>, setSelectedRoom?: React.Dispatch<React.SetStateAction<Rooms | null>>, setSelectedTimetable?: React.Dispatch<React.SetStateAction<Timetables | null>>) => {
    setSelectedAppointments([]);
    setSelectedPresentator ? setSelectedPresentator(null) : null;
    setSelectedRoom ? setSelectedRoom(null) : null;
    setSelectedTimetable ? setSelectedTimetable(null) : null;
    const selected = list?.find(item => item.getId() === id) || null;
    setter(selected);
};

export const resetState = (setSelectedTimetable: React.Dispatch<React.SetStateAction<any | null>>, setSelectedPresentator: React.Dispatch<React.SetStateAction<any | null>>, setSelectedRoom: React.Dispatch<React.SetStateAction<any | null>>, setSelectedAppointments: React.Dispatch<React.SetStateAction<Appointments[] | []>>, setError: React.Dispatch<React.SetStateAction<string[]>>) => {
    setSelectedTimetable(null);
    setSelectedPresentator(null);
    setSelectedRoom(null);
    setSelectedAppointments([]);
    setError([]);
};