import { redirect, useNavigate } from "react-router";
import { Institutions } from "../../shared/classes/institutions";
import { AppointmentDay } from "./AppointmentDay";
import { useEffect, useInsertionEffect, useState } from "react";
import { Presentators } from "../../shared/classes/presentators";
import { Rooms } from "../../shared/classes/rooms";
import { Timetables } from "../../shared/classes/timetables";
import { Appointments } from "../../shared/classes/appointments";
import { Subjects } from "../../shared/classes/subjects";

interface ScheduleProps {

    institution: Institutions[];

}

/*nem, maga az institution egy objektum es annak van egy group tombje ami group objektum (class mind a ketto) es nekem van egy tombom amiben az institutionokat tarolom es kene ra egy select hogy kivalasythato legyen egy institution es egy masik select hogy a kivalasztott institutionnek a groupjai kozul tudjak valasztani es ezt mind react usestateben typescriptben*/

export function Schedule(props: ScheduleProps) {
    const [selectedInstitution, setSelectedInstitution] = useState<Institutions | null>(null);
    const [selectedTimetablelist, setSelectedTimetablelist] = useState<Timetables[]>([]);
    const [selectedTimetable, setSelectedTimetable] = useState<Timetables | null>(null);
    const [mondayAppointments, setMondayAppointments] = useState<Appointments[]>([]);
    const [tuesdayAppointments, setTuesdayAppointments] = useState<Appointments[]>([]);
    const [wednesdayAppointments, setWednesdayAppointments] = useState<Appointments[]>([]);
    const [thursdayAppointments, setThursdayAppointments] = useState<Appointments[]>([]);
    const [fridayAppointments, setFridayAppointments] = useState<Appointments[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        fetchTimetables(selectedInstitution!);
    }, [selectedInstitution]);

    useEffect(() => {
        fetchAppointments(selectedTimetablelist!);
    }, [selectedTimetablelist]);

    async function fetchTimetables(selectedinstitution: Institutions) {
        console.log("fetching timetables")
        console.log(selectedinstitution)
        let timetablelist = [];
        const response = await fetch(`http://localhost:3000/institutions/${selectedinstitution.getId()}/timetables`)
        const timetables = await response.json()
        console.log(timetables)
        for (let i = 0; i < timetables.length; i++) {
            let timetable: Timetables = new Timetables(timetables[i].id, timetables[i].name, selectedinstitution, selectedinstitution.getId());
            timetablelist.push(timetable)
        }
        setSelectedTimetablelist(timetablelist)
    }

    async function fetchAppointments(selectedttablelist: Timetables[]) {
        console.log("fetching appointments")
        console.log(selectedttablelist)
        for (let i = 0; i < selectedttablelist.length; i++) {
            const response = await fetch(`http://localhost:3000/institutions/${selectedttablelist[i].getInstitutionId()}/timetables/${selectedttablelist[i].getId()}/appointments`)
            const appointments = await response.json()
            let oneapplist = [];
            for (let i = 0; i < appointments.length; i++) {
                let oneroomlist = [];
                let onepreslist = [];
                for (let j = 0; j < appointments[i].rooms.length; j++) {
                    oneroomlist.push(new Rooms(appointments[i].rooms[j].id, appointments[i].rooms[j].name, appointments[i].rooms[j].isAvailable, appointments[i].rooms[j].institutionId));
                }
                for (let j = 0; j < appointments[i].presentators.length; j++) {
                    onepreslist.push(new Presentators(appointments[i].presentators[j].id, appointments[i].presentators[j].name, appointments[i].presentators[j].institutionId));
                }
                let subject: Subjects = new Subjects(appointments[i].subject.id, appointments[i].subject.name, appointments[i].subject.subjectId, appointments[i].subject.institutionId);
                let appointment: Appointments = new Appointments(appointments[i].id, subject, onepreslist, oneroomlist, appointments[i].dayOfWeek, appointments[i].start, appointments[i].end, appointments[i].isCancelled);
                oneapplist.push(appointment)
            }
            selectedttablelist[i].setAppointments(oneapplist)
        }
    }

    const handleInstitutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const institutionId = e.target.value;
        const institution = props.institution.find(inst => inst.getId() === institutionId) || null;
        console.log(institution)
        if (institution?.getAccess() === "PRIVATE") {
            navigate("/login");
        } else {
            setSelectedInstitution(institution!);
        }
    };

    const handleTimeTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const ttId = e.target.value;
        const timetable = selectedTimetablelist?.find(t => t.getId() === ttId) || null;
        for (let i = 0; i < timetable!.getAppointments()!.length; i++) {
            if (timetable!.getAppointments()![i].getDayOfWeek() === "MONDAY") {
                mondayAppointments.push(timetable!.getAppointments()![i])
            }
            if (timetable!.getAppointments()![i].getDayOfWeek() === "TUESDAY") {
                tuesdayAppointments.push(timetable!.getAppointments()![i])
            }
            if (timetable!.getAppointments()![i].getDayOfWeek() === "WEDNESDAY") {
                wednesdayAppointments.push(timetable!.getAppointments()![i])
            }
            if (timetable!.getAppointments()![i].getDayOfWeek() === "THURSDAY") {
                thursdayAppointments.push(timetable!.getAppointments()![i])
            }
            if (timetable!.getAppointments()![i].getDayOfWeek() === "FRIDAY") {
                fridayAppointments.push(timetable!.getAppointments()![i])
            }
        }
        setSelectedTimetable(timetable);
        console.log(mondayAppointments, 'monday')
        console.log(tuesdayAppointments, 'tuesday')
        console.log(wednesdayAppointments, 'wednesday')
        console.log(thursdayAppointments, 'thursday')
        console.log(fridayAppointments, 'friday')
    };

    return (
        <div className="main">
            <div className="sidebar">
                <select onChange={handleInstitutionChange} value={selectedInstitution?.getId() || 'default'}>
                    <option value={"default"} disabled>Institutions</option>
                    {props.institution.map((institution: Institutions) => (
                        <option key={institution.getId()} value={institution.getId()}>{institution.getName()}</option>
                    ))}
                </select>
                <select onChange={handleTimeTableChange} value={selectedTimetable?.getId() || 'default'}>
                    <option value="default" disabled>TimeTables</option>
                    {selectedTimetablelist?.map((tt: Timetables) => (
                        <option key={tt.getId()} value={tt.getId()}>{tt.getName()}</option>
                    ))}
                </select>
            </div>
            <div className="schedule">
                <div className="day-1">
                    <div className="day-header-mon">Monday</div>
                    <AppointmentDay appointments={mondayAppointments!} />
                </div>
                <div className="day-2">
                    <div className="day-header-tue">Tuesday</div>
                    <AppointmentDay appointments={tuesdayAppointments!} />
                </div>
                <div className="day-3">
                    <div className="day-header-wed">Wednesday</div>
                    <AppointmentDay appointments={wednesdayAppointments!} />
                </div>
                <div className="day-4">
                    <div className="day-header-thu">Thursday</div>
                    <AppointmentDay appointments={thursdayAppointments!} />
                </div>
                <div className="day-5">
                    <div className="day-header-fri">Friday</div>
                    <AppointmentDay appointments={fridayAppointments!} />
                </div>
            </div>
            <div className="sidebar">
                <button>Change view</button>
            </div>
        </div>
    )
}