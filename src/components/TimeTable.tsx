import { AppointmentDay } from "./UserUI/AppointmentDay";
import { Appointments } from "../shared/classes/appointments";
import { Presentators } from "../shared/classes/presentators";

interface Props {
    data: {
        monday: Appointments[],
        tuesday: Appointments[],
        wednesday: Appointments[],
        thursday: Appointments[],
        friday: Appointments[],
        presentatorlist: Presentators[]
    }
}

export function TimeTable(props: Props) {
    
    return (
        <>
            <div className="day-1 days">
                <div className="day-header-mon day-header">Monday</div>
                <AppointmentDay appointments={props.data.monday!} presentatorlist={props.data.presentatorlist!} />
            </div>
            <div className="day-2 days">
                <div className="day-header-tue day-header">Tuesday</div>
                <AppointmentDay appointments={props.data.tuesday!} presentatorlist={props.data.presentatorlist!} />
            </div>
            <div className="day-3 days">
                <div className="day-header-wed day-header">Wednesday</div>
                <AppointmentDay appointments={props.data.wednesday!} presentatorlist={props.data.presentatorlist!} />
            </div>
            <div className="day-4 days">
                <div className="day-header-thu day-header">Thursday</div>
                <AppointmentDay appointments={props.data.thursday!} presentatorlist={props.data.presentatorlist!} />
            </div>
            <div className="day-5 days">
                <div className="day-header-fri day-header">Friday</div>
                <AppointmentDay appointments={props.data.friday!} presentatorlist={props.data.presentatorlist!} />
            </div>
        </>
    )
}