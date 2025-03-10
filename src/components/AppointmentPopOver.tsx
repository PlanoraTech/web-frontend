import { useState } from "react";
import { Appointments } from "../shared/classes/appointments";
import { Presentators } from "../shared/classes/presentators";
import { Rooms } from "../shared/classes/rooms";
import { getTimeWithZeros } from "../functions/getTimeWithZeros";

interface Props {
    appointment: Appointments;
    presentatorlist: Presentators[];
    roomlist?: Rooms[];
    show: boolean;
    type: 'main' | 'manage';
    x: number;
    y: number;
}

export function AppointmentPopOver(props: Props) {
    const [close, setClose] = useState(false);

    return (
        <>
            <div className="popover" style={{ display: close ? "none" : "block", top: props.y, left: props.x }}>
                <button className="close" onClick={() => { setClose(true) }}><b>✕</b></button>
                {
                    props.type == 'main' ? (
                        <div className="popover_content">
                            <div className="popover_header">
                                <h3>{props.appointment.getSubject()?.getName()}</h3>
                            </div>
                            <div className="popover_body">
                                <p style={{ fontSize: '1.1rem' }}>{getTimeWithZeros(props.appointment.getStart())} - {getTimeWithZeros(props.appointment.getEnd())}</p>
                                <label><b>Room(s):</b></label>
                                <p>{props.appointment.getRooms()?.map(room => room.getName()).join(", ")}</p>
                                <label><b>Presentator(s):</b></label>
                                <p>{props.appointment.getPresentators()?.map(pres => pres.getName()).join(", ")}</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="popover_content">
                                <div className="popover_header">
                                    <h3>{props.appointment.getSubject()?.getName()}</h3>
                                </div>
                                <div className="popover_body">
                                    <p>{props.appointment.getRooms()?.map(room => room.getName()).join(", ")}</p>
                                    <p>{getTimeWithZeros(props.appointment.getStart())} - {getTimeWithZeros(props.appointment.getEnd())}</p>
                                    <p>{props.appointment.getPresentators()?.map(pres => pres.getName()).join(", ")}</p>
                                </div>
                            </div>
                        </>
                    )
                }

            </div>
        </>
    )
}