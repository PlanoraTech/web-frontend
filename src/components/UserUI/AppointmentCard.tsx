import { Appointments } from "../../shared/classes/appointments"

interface Props {
    appointment: Appointments;
}

export function AppointmentCard(props: Props) {

    function getallrooms(): string {
        const rooms = props.appointment.getRooms();
        if (!rooms || rooms.length === 0) {
            return "";
        }
        return rooms.map(room => room.getName()).join(" ");
    }

    function getallpres(): string {
        const presentators = props.appointment.getPresentators();
        if (!presentators || presentators.length === 0) {
            return "";
        }
        return presentators.map(pres => pres.getName()).join(" ");
    }

    function getzero(time: Date): string {
        return `${("0" + time.getHours()).slice(-2)}:${("0" + time.getMinutes()).slice(-2)}`
    }

    return (
        <div className="class-card" title={`${props.appointment.getSubject()?.getName()} - Room ${getallrooms()} - Date ${props.appointment.getStart().getMonth()}.${props.appointment.getStart().getDate()}. - ${props.appointment.getEnd().getMonth()}.${props.appointment.getEnd().getDate()}. - ${getzero(props.appointment.getStart())} - ${getzero(props.appointment.getEnd())} - ${getallpres()}`}>
            <h3><b>{props.appointment.getSubject()?.getName()}</b></h3>
            <div className="class-container">
                <p>{getallrooms()} - {getzero(props.appointment.getStart())} - {getzero(props.appointment.getEnd())}</p>
            </div>
        </div>
    )
}