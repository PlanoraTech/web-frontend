import { useState } from "react";
import { Appointments } from "../../shared/classes/appointments";
import { Presentators } from "../../shared/classes/presentators";
import { Rooms } from "../../shared/classes/rooms";

interface Props {
    appointment: Appointments;
    presentatorlist: Presentators[];
    roomlist?: Rooms[];
    show: boolean;
}

export function AppointmentPopOver(props: Props) {
    const [close, setClose] = useState(false);

    return (
        <>
            <div className="popover" style={{ display: close ? "none" : "block" }}>
                <button className="close" onClick={() => { setClose(true) }}>X</button>
                <div className="popover-content">
                    <div className="popover-header">
                        <h3>{props.appointment.getSubject()?.getName()}</h3>
                    </div>
                    <div className="popover-body">
                        <p>{props.appointment.getStart().toLocaleTimeString()} - {props.appointment.getEnd().toLocaleTimeString()}</p>
                        <p>{props.appointment.getPresentators()?.map(pres => pres.getName()).join(", ")}</p>
                        <p>{props.appointment.getRooms()?.map(room => room.getName()).join(", ")}</p>
                    </div>
                </div>
            </div>
        </>
    )
}