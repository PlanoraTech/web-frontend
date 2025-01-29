import { Appointments } from "../../shared/classes/appointments";
import { AppointmentCard } from "./AppointmentCard"
import { useEffect } from "react";

interface Props {
    appointments: Appointments[];
}

export function AppointmentDay(props: Props) {

    useEffect(() => {
        console.log("AppointmentDay props changed");
    }, []);
    const sorted = props.appointments.sort((a, b) => a.getStart().getTime() - b.getStart().getTime());


    return (
        <>
            {
                sorted.length > 0 ? (
                    sorted.map((appointment, index) => (
                        <AppointmentCard key={index} appointment={appointment} />
                    ))
                ) : (
                    <div className="class-card" title="No appointments for today! Lucky you!">
                        <h3><b>Nothing :)</b></h3>
                        <div className="class-container">
                            <p>No appointments for today!</p>
                        </div>
                    </div>
                )
            }
        </>
    )
}