import { useNavigate } from "react-router";
import { Institutions } from "../../shared/classes/institutions";
import { AppointmentDay } from "./AppointmentDay";
import { useEffect, useState } from "react";
import { Presentators } from "../../shared/classes/presentators";
import { Rooms } from "../../shared/classes/rooms";
import { Timetables } from "../../shared/classes/timetables";
import { Appointments } from "../../shared/classes/appointments";
import { Subjects } from "../../shared/classes/subjects";
import { Events } from "../../shared/classes/events";
import { EventDay } from "./EventDay";

interface ScheduleProps {
    institution: Institutions[];
}

export function Schedule(props: ScheduleProps) {
    const [selectedInstitution, setSelectedInstitution] = useState<Institutions | null>(null);
    const [selectedTimetablelist, setSelectedTimetablelist] = useState<Timetables[]>([]);
    const [selectedTimetable, setSelectedTimetable] = useState<Timetables | null>(null);
    const [selectedPresentatorlist, setSelectedPresentatorlist] = useState<Presentators[] | null>(null);
    const [selectedPresentator, setSelectedPresentator] = useState<Presentators | null>(null);
    const [selectedRoomlist, setSelectedRoomlist] = useState<Rooms[] | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Rooms | null>(null);
    const [mondayAppointments, setMondayAppointments] = useState<Appointments[]>([]);
    const [tuesdayAppointments, setTuesdayAppointments] = useState<Appointments[]>([]);
    const [wednesdayAppointments, setWednesdayAppointments] = useState<Appointments[]>([]);
    const [thursdayAppointments, setThursdayAppointments] = useState<Appointments[]>([]);
    const [fridayAppointments, setFridayAppointments] = useState<Appointments[]>([]);
    const [maxLength, setMaxLength] = useState(0);
    const [error, setError] = useState("");

    const navigate = useNavigate();
    const baseUrl = "http://localhost:3000/institutions";

    useEffect(() => {
        fetchTimetables(selectedInstitution!);
        fetchPresentators(selectedInstitution!);
        fetchRooms(selectedInstitution!);
        fetchEvents(selectedInstitution!);
    }, [selectedInstitution]);

    useEffect(() => {
        fetchTimetableAppointments(selectedTimetablelist!);
    }, [selectedTimetablelist]);

    useEffect(() => {
        fetchPresentatorAppointments(selectedPresentatorlist!);
    }, [selectedPresentatorlist]);

    useEffect(() => {
        fetchRoomAppointments(selectedRoomlist!);
    }, [selectedRoomlist]);

    async function fetchTimetables(selectedinstitution: Institutions) {
        let timetablelist = [];
        let url = `${baseUrl}/${selectedinstitution.getId()}/timetables`;
        if (localStorage.getItem('token')) {
            url = `${baseUrl}/${selectedinstitution.getId()}/timetables/?token=${localStorage.getItem('token')}`
        }
        const response = await fetch(url)
        const timetables = await response.json()
        if (response.status === 403) {
            setError("You no not have permission to view this institution's timetables!")
        } else {
            setError("");
        }
        for (let i = 0; i < timetables.length; i++) {
            let timetable: Timetables = new Timetables(timetables[i].id, timetables[i].name, selectedinstitution, selectedinstitution.getId());
            timetablelist.push(timetable)
        }
        setSelectedTimetablelist(timetablelist.sort((a, b) => a.getName().localeCompare(b.getName())))
    }

    async function fetchPresentators(selectedinstitution: Institutions) {
        let presentatorlist = [];
        let url = `${baseUrl}/${selectedinstitution.getId()}/presentators`
        if (localStorage.getItem('token')) {
            url = `${baseUrl}/${selectedinstitution.getId()}/presentators/?token=${localStorage.getItem('token')}`
        }
        const response = await fetch(url)
        const presentators = await response.json()
        for (let i = 0; i < presentators.length; i++) {
            presentatorlist.push(new Presentators(presentators[i].id, presentators[i].name, selectedinstitution.getId()));
        }
        selectedinstitution.setPresentators(presentatorlist);
        setSelectedPresentatorlist(presentatorlist.sort((a, b) => a.getName().localeCompare(b.getName())))
    }

    async function fetchRooms(selectedinstitution: Institutions) {
        let roomlist = [];
        let url = `${baseUrl}/${selectedinstitution.getId()}/rooms`
        if (localStorage.getItem('token')) {
            url = `${baseUrl}/${selectedinstitution.getId()}/rooms/?token=${localStorage.getItem('token')}`
        }
        const response = await fetch(url)
        const rooms = await response.json()
        for (let i = 0; i < rooms.length; i++) {
            roomlist.push(new Rooms(rooms[i].id, rooms[i].name, rooms[i].isAvailable, selectedinstitution.getId()));
        }
        selectedinstitution.setRooms(roomlist);
        setSelectedRoomlist(roomlist.sort((a, b) => a.getName().localeCompare(b.getName())))
    }

    async function fetchEvents(selectedinstitution: Institutions) {
        let eventlist = [];
        let url = `${baseUrl}/${selectedinstitution.getId()}/events`
        if (localStorage.getItem('token')) {
            url = `${baseUrl}/${selectedinstitution.getId()}/events/?token=${localStorage.getItem('token')}`
        }
        const response = await fetch(url)
        const events = await response.json()
        for (let i = 0; i < events.length; i++) {
            eventlist.push(new Events(events[i].id, events[i].title, events[i].date, selectedinstitution.getId()));
        }
        selectedinstitution.setEvents(eventlist.sort((a, b) => a.getDate().getTime() - b.getDate().getTime()));
    }

    async function fetchTimetableAppointments(selectedttablelist: Timetables[]) {
        for (let i = 0; i < selectedttablelist.length; i++) {
            let url = `${baseUrl}/${selectedttablelist[i].getInstitutionId()}/timetables/${selectedttablelist[i].getId()}/appointments`
            if (localStorage.getItem('token')) {
                url = `${baseUrl}/${selectedttablelist[i].getInstitutionId()}/timetables/${selectedttablelist[i].getId()}/appointments/?token=${localStorage.getItem('token')}`
            }
            const response = await fetch(url)
            const appointments = await response.json()
            // console.log(appointments)
            let oneapplist = [];
            for (let i = 0; i < appointments.length; i++) {
                let oneroomlist = [];
                let onepreslist = [];
                for (let j = 0; j < appointments[i].rooms.length; j++) {
                    oneroomlist.push(new Rooms(appointments[i].rooms[j].id, appointments[i].rooms[j].name, appointments[i].rooms[j].isAvailable, appointments[i].rooms[j].institutionId));
                }
                for (let j = 0; j < appointments[i].presentators.length; j++) {
                    let pres: Presentators = new Presentators(appointments[i].presentators[j].id, appointments[i].presentators[j].name, appointments[i].presentators[j].institutionId);
                    pres.setIsSubstituted(appointments[i].presentators[j].isSubstituted);
                    onepreslist.push(pres);
                }
                let subject: Subjects = new Subjects(appointments[i].subject.id, appointments[i].subject.name, appointments[i].subject.subjectId, appointments[i].subject.institutionId);
                let appointment: Appointments = new Appointments(appointments[i].id, subject, onepreslist, oneroomlist, appointments[i].dayOfWeek, appointments[i].start, appointments[i].end, appointments[i].isCancelled)
                appointment.setInstitutionId(selectedInstitution!.getId()!)
                oneapplist.push(appointment);
            }
            selectedttablelist[i].setAppointments(oneapplist)
            // console.log(oneapplist)
        }
    }

    async function fetchPresentatorAppointments(selectedpresentatorlist: Presentators[]) {
        for (let i = 0; i < selectedpresentatorlist.length; i++) {
            let url = `${baseUrl}/${selectedpresentatorlist[i].getInstitutionId()}/presentators/${selectedpresentatorlist[i].getId()}/appointments`
            if (localStorage.getItem('token')) {
                url = `${baseUrl}/${selectedpresentatorlist[i].getInstitutionId()}/presentators/${selectedpresentatorlist[i].getId()}/appointments/?token=${localStorage.getItem('token')}`
            }
            const response = await fetch(url)
            const appointments = await response.json()
            // console.log(appointments)
            let oneapplist = [];
            for (let i = 0; i < appointments.length; i++) {
                let oneroomlist = [];
                let onepreslist = [];
                for (let j = 0; j < appointments[i].rooms.length; j++) {
                    oneroomlist.push(new Rooms(appointments[i].rooms[j].id, appointments[i].rooms[j].name, appointments[i].rooms[j].isAvailable, appointments[i].rooms[j].institutionId));
                }
                for (let j = 0; j < appointments[i].presentators.length; j++) {
                    let pres: Presentators = new Presentators(appointments[i].presentators[j].id, appointments[i].presentators[j].name, appointments[i].presentators[j].institutionId);
                    pres.setIsSubstituted(appointments[i].presentators[j].isSubstituted);
                    onepreslist.push(pres);
                }
                let subject: Subjects = new Subjects(appointments[i].subject.id, appointments[i].subject.name, appointments[i].subject.subjectId, appointments[i].subject.institutionId);
                let appointment: Appointments = new Appointments(appointments[i].id, subject, onepreslist, oneroomlist, appointments[i].dayOfWeek, appointments[i].start, appointments[i].end, appointments[i].isCancelled)
                appointment.setInstitutionId(selectedInstitution!.getId()!)
                oneapplist.push(appointment);
            }
            selectedpresentatorlist[i].setAppointments(oneapplist)
            // console.log(oneapplist)
        }
    }

    async function fetchRoomAppointments(selectedroomlist: Rooms[]) {
        for (let i = 0; i < selectedroomlist.length; i++) {
            let url = `${baseUrl}/${selectedroomlist[i].getInstitutionId()}/rooms/${selectedroomlist[i].getId()}/appointments`
            if (localStorage.getItem('token')) {
                url = `${baseUrl}/${selectedroomlist[i].getInstitutionId()}/rooms/${selectedroomlist[i].getId()}/appointments/?token=${localStorage.getItem('token')}`
            }
            const response = await fetch(url)
            const appointments = await response.json()
            // console.log(appointments)
            let oneapplist = [];
            for (let i = 0; i < appointments.length; i++) {
                let oneroomlist = [];
                let onepreslist = [];
                for (let j = 0; j < appointments[i].rooms.length; j++) {
                    oneroomlist.push(new Rooms(appointments[i].rooms[j].id, appointments[i].rooms[j].name, appointments[i].rooms[j].isAvailable, appointments[i].rooms[j].institutionId));
                }
                for (let j = 0; j < appointments[i].presentators.length; j++) {
                    let pres: Presentators = new Presentators(appointments[i].presentators[j].id, appointments[i].presentators[j].name, appointments[i].presentators[j].institutionId);
                    pres.setIsSubstituted(appointments[i].presentators[j].isSubstituted);
                    onepreslist.push(pres);
                }
                let subject: Subjects = new Subjects(appointments[i].subject.id, appointments[i].subject.name, appointments[i].subject.subjectId, appointments[i].subject.institutionId);
                let appointment: Appointments = new Appointments(appointments[i].id, subject, onepreslist, oneroomlist, appointments[i].dayOfWeek, appointments[i].start, appointments[i].end, appointments[i].isCancelled)
                appointment.setInstitutionId(selectedInstitution!.getId()!)
                oneapplist.push(appointment);
                // console.log(oneapplist)
            }
            selectedroomlist[i].setAppointments(oneapplist)
        }
    }


    function sortDays(appointments: Appointments[]) {
        for (let i = 0; i < appointments!.length; i++) {
            if (appointments![i].getStart().getDay() === 1) {
                mondayAppointments.push(appointments![i])
            }
            if (appointments![i].getStart().getDay() === 2) {
                tuesdayAppointments.push(appointments![i])
            }
            if (appointments![i].getStart().getDay() === 3) {
                wednesdayAppointments.push(appointments![i])
            }
            if (appointments![i].getStart().getDay() === 4) {
                thursdayAppointments.push(appointments![i])
            }
            if (appointments![i].getStart().getDay() === 5) {
                fridayAppointments.push(appointments![i])
            }
        }
    }

    const handleInstitutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const institutionId = e.target.value;
        const institution = props.institution.find(inst => inst.getId() === institutionId) || null;
        console.log(institution)
        if (institution?.getAccess() === "PRIVATE" && !localStorage.getItem('token')) {
            navigate("/login");
        } else {
            setSelectedInstitution(institution!);
            setSelectedTimetable(null);
            setSelectedPresentator(null);
            setSelectedRoom(null);
            clearlists();
        }
    };

    const handleTimeTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const ttId = e.target.value;
        const timetable = selectedTimetablelist?.find(t => t.getId() === ttId) || null;
        setSelectedPresentator(null);
        setSelectedRoom(null);
        clearlists();
        sortDays(timetable!.getAppointments()!)
        setSelectedTimetable(timetable);
        longest([mondayAppointments, tuesdayAppointments, wednesdayAppointments, thursdayAppointments, fridayAppointments]);
        // console.log(timetable)
    };

    const handlePresentatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const presId = e.target.value;
        const presentator = selectedPresentatorlist?.find(p => p.getId() === presId) || null;
        setSelectedTimetable(null);
        setSelectedRoom(null);
        clearlists();
        sortDays(presentator!.getAppointments()!)
        setSelectedPresentator(presentator);
        longest([mondayAppointments, tuesdayAppointments, wednesdayAppointments, thursdayAppointments, fridayAppointments]);
        // console.log(presentator)
    };

    const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const roomId = e.target.value;
        const room = selectedRoomlist?.find(r => r.getId() === roomId) || null;
        setSelectedTimetable(null);
        setSelectedPresentator(null);
        clearlists();
        sortDays(room!.getAppointments()!)
        setSelectedRoom(room);
        longest([mondayAppointments, tuesdayAppointments, wednesdayAppointments, thursdayAppointments, fridayAppointments]);
        // console.log(room)
    }

    function longest(lists: Appointments[][]) {
        let maxLength = 0;
        lists.forEach((list) => {
            if (list.length > maxLength) {
                maxLength = list.length;
            }
        });
        setMaxLength(lists.length - 1);
    }

    function clearlists() {
        mondayAppointments.length = 0;
        tuesdayAppointments.length = 0;
        wednesdayAppointments.length = 0;
        thursdayAppointments.length = 0;
        fridayAppointments.length = 0;
    }

    return (
        <>
            {!selectedInstitution && (
                <h3 className="choose">Choose an institution!</h3>
            )}
            {selectedInstitution && !error && !selectedTimetable && !selectedPresentator && !selectedRoom && (
                <h3 className="choose">Choose a timetable or presentator or a room!</h3>
            )}
            {selectedInstitution && selectedTimetable && (
                <h3 className="choose">{selectedTimetable.getName()}</h3>
            )}
            {selectedInstitution && selectedPresentator && (
                <h3 className="choose">{selectedPresentator.getName()}</h3>
            )}
            {selectedInstitution && selectedRoom && (
                <h3 className="choose">Room {selectedRoom.getName()}</h3>
            )}
            {error && (
                <h3 style={{ color: '#fc6464' }} className="choose">{error}</h3>
            )}
            <div className="main">
                <div className="sidebar">
                    <select onChange={handleInstitutionChange} value={selectedInstitution?.getId() || 'default'}>
                        <option value={"default"} disabled>Institutions</option>
                        {props.institution.map((institution: Institutions) => (
                            <option key={institution.getId()} value={institution.getId()}>{institution.getName()}</option>
                        ))}
                    </select>
                    {selectedInstitution ?
                        <>
                            <select onChange={handleTimeTableChange} value={selectedTimetable?.getId() || 'default'}>
                                <option value="default" disabled>TimeTables</option>
                                {selectedTimetablelist?.map((tt: Timetables) => (
                                    <option key={tt.getId()} value={tt.getId()}>{tt.getName()}</option>
                                ))}
                            </select>
                            <select onChange={handlePresentatorChange} value={selectedPresentator?.getId() || 'default'}>
                                <option value="default" disabled>Presentators</option>
                                {selectedPresentatorlist?.map((pres: Presentators) => (
                                    <option key={pres.getId()} value={pres.getId()}>{pres.getName()}</option>
                                ))}
                            </select>
                            <select onChange={handleRoomChange} value={selectedRoom?.getId() || 'default'}>
                                <option value="default" disabled>Rooms</option>
                                {selectedRoomlist?.map((room: Rooms) => (
                                    <option key={room.getId()} value={room.getId()}>{room.getName()}</option>
                                ))}
                            </select>
                        </>
                        : null}
                </div>
                <div className="schedule">
                    <div className="day-1 days" >
                        <div className="day-header-mon day-header">Monday</div>
                        <AppointmentDay appointments={mondayAppointments!} presentatorlist={selectedPresentatorlist!} />
                    </div>
                    <div className="day-2 days">
                        <div className="day-header-tue day-header">Tuesday</div>
                        <AppointmentDay appointments={tuesdayAppointments!} presentatorlist={selectedPresentatorlist!} />
                    </div>
                    <div className="day-3 days">
                        <div className="day-header-wed day-header">Wednesday</div>
                        <AppointmentDay appointments={wednesdayAppointments!} presentatorlist={selectedPresentatorlist!} />
                    </div>
                    <div className="day-4 days">
                        <div className="day-header-thu day-header">Thursday</div>
                        <AppointmentDay appointments={thursdayAppointments!} presentatorlist={selectedPresentatorlist!} />
                    </div>
                    <div className="day-5 days">
                        <div className="day-header-fri day-header">Friday</div>
                        <AppointmentDay appointments={fridayAppointments!} presentatorlist={selectedPresentatorlist!} />
                    </div>
                </div>
                <div className="sidebar">
                    <div className="events-container">
                        <h4>Events:</h4>
                        <div className="events-card-container">
                            {selectedInstitution && selectedInstitution.getEvents() && selectedInstitution.getEvents()!.length > 0 ? (
                                selectedInstitution!.getEvents()?.map((event: Events) => (
                                    <EventDay key={event.getId()} event={event} />
                                ))
                            ) : (
                                <div className="event-card" title="No events for today!">
                                    <h3><b>Nothing :)</b></h3>
                                    <div className="event-container">
                                        <p>No events for today!</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}