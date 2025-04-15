import { Presentators } from "../shared/classes/presentators";
import { Rooms } from "../shared/classes/rooms";
import { Timetables } from "../shared/classes/timetables";

interface Props {
    handleTimeTableChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    selectedTimetable: Timetables | null;
    selectedTimetablelist: Timetables[];
    handlePresentatorChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    selectedPresentator: Presentators | null;
    selectedPresentatorlist: Presentators[];
    handleRoomChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    selectedRoom: Rooms | null;
    selectedRoomlist: Rooms[];
}

export function AppointmentSelects(props: Props) {
    return (
        <>
            <select onChange={props.handleTimeTableChange} value={props.selectedTimetable?.getId() || 'default'}>
                <option value="default" disabled>TimeTables</option>
                {props.selectedTimetablelist?.map((tt: Timetables) => (
                    <option key={tt.getId()} value={tt.getId()}>{tt.getName()} - '{tt.getVersion()}'</option>
                ))}
            </select>
            <select onChange={props.handlePresentatorChange} value={props.selectedPresentator?.getId() || 'default'}>
                <option value="default" disabled>Presentators</option>
                {props.selectedPresentatorlist?.map((pres: Presentators) => (
                    <option key={pres.getId()} value={pres.getId()}>{pres.getName()}</option>
                ))}
            </select>
            <select onChange={props.handleRoomChange} value={props.selectedRoom?.getId() || 'default'}>
                <option value="default" disabled>Rooms</option>
                {props.selectedRoomlist?.map((room: Rooms) => (
                    <option key={room.getId()} value={room.getId()}>{room.getName()}</option>
                ))}
            </select>
        </>
    )
}