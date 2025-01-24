import { Appointments } from "../../shared/classes/appointments";
import { AppointmentCard } from "./AppointmentCard"

interface Props {
    appointments: Appointments[];
}

export function AppointmentDay(props: Props) {
    console.log(props.appointments);
    const sorted = props.appointments!.sort((a, b) => a.getStart().getTime() - b.getStart().getTime());
    console.log(sorted);
    const fullysorted: Appointments[] = [];
    let currentEndTime: Date | null = null;

    for (const appointment of sorted) {
        console.log(currentEndTime)
        if (currentEndTime === null || appointment.getStart() >= currentEndTime) {
            console.log('asd')
            fullysorted.push(appointment);
            currentEndTime = appointment.getEnd();
        }
    }

    console.log(fullysorted);


    return (
        <>

            {
                sorted.map((appointment, index) => (
                    <AppointmentCard key={index} appointment={appointment} />
                ))
            }
        </>
    )
}