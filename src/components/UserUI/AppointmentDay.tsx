import { Appointments } from "../../shared/classes/appointments";
import { Presentators } from "../../shared/classes/presentators";
import { AppointmentCard } from "./AppointmentCard"

interface Props {
    appointments: Appointments[];
    presentatorlist: Presentators[];
}

export function AppointmentDay(props: Props) {
    const sorted = props.appointments.sort((a, b) => a.getStart().getTime() - b.getStart().getTime());

    return (
        <div className="card-container">
            {
                sorted.length > 0 ? (
                    sorted.map((appointment, index) => (
                        <AppointmentCard key={index} appointment={appointment} presentatorlist={props.presentatorlist!} />
                    ))
                ) : (
                    <div className="class-card" title="No appointments for today! Lucky you!">
                        <h3><b>Nothing :)</b></h3>
                        <div className="class-container">
                            <p className="rooms">No appointments for today!</p>
                        </div>
                    </div>
                )
            }
        </div>
    )
}