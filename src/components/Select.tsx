import { Appointments } from "../shared/classes/appointments";
import { Presentators } from "../shared/classes/presentators";
import { Rooms } from "../shared/classes/rooms"

interface Props {
    appointment: Appointments;
    item: Rooms[] | Presentators[];
    deleteOption: (e: React.MouseEvent<HTMLButtonElement>) => void;
    list: 'room' | 'presentator';
}

export function Select(props: Props) {
    return (
        <>
            {
                props.list == 'room' ? (
                    props.appointment!.getRooms()?.map(room => (
                        <div key={room.getId()} id={room.getId()}>
                            <select key={room.getId()} value={room.getId()}>
                                {(props.list == 'room' ? props.item as Rooms[] : []).map((room: Rooms) => (
                                    <option key={room.getId()} value={room.getId()}>{room.getName()}</option>
                                ))}
                            </select>
                            <button className="close" onClick={props.deleteOption}><b>✕</b></button>
                        </div>
                    ))
                ) : (
                    props.appointment!.getPresentators()?.map(pres => (
                        <div key={pres.getId()} id={pres.getId()}>
                            <select key={pres.getId()} value={pres.getId()}>
                                {(props.list == 'presentator' ? props.item as Presentators[] : []).map((pres: Presentators) => (
                                    <option key={pres.getId()} value={pres.getId()}>{pres.getName()}</option>
                                ))}
                            </select>
                            <button className="close" onClick={props.deleteOption}><b>✕</b></button>
                        </div>
                    ))
                )
            }
        </>
    )
}