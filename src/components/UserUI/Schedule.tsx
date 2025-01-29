import { useNavigate } from "react-router";
import { Institutions } from "../../shared/classes/institutions";
import { AppointmentDay } from "./AppointmentDay";
import { useEffect, useState } from "react";
import { Presentators } from "../../shared/classes/presentators";
import { Rooms } from "../../shared/classes/rooms";
import { Timetables } from "../../shared/classes/timetables";
import { Appointments } from "../../shared/classes/appointments";
import { Subjects } from "../../shared/classes/subjects";

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


    const navigate = useNavigate();

    useEffect(() => {
        fetchTimetables(selectedInstitution!);
    }, [selectedInstitution]);

    useEffect(() => {
        fetchPresentators(selectedInstitution!);
    }, [selectedInstitution]);

    useEffect(() => {
        fetchRooms(selectedInstitution!);
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
        console.log("fetching timetables")
        let timetablelist = [];
        const response = await fetch(`http://localhost:3000/institutions/${selectedinstitution.getId()}/timetables`)
        const timetables = await response.json()
        for (let i = 0; i < timetables.length; i++) {
            let timetable: Timetables = new Timetables(timetables[i].id, timetables[i].name, selectedinstitution, selectedinstitution.getId());
            timetablelist.push(timetable)
        }
        setSelectedTimetablelist(timetablelist)
    }

    async function fetchPresentators(selectedinstitution: Institutions) {
        console.log("fetching presentators")
        let presentatorlist = [];
        const response = await fetch(`http://localhost:3000/institutions/${selectedinstitution.getId()}/presentators`)
        const presentators = await response.json()
        for (let i = 0; i < presentators.length; i++) {
            let pr: Presentators = new Presentators(presentators[i].id, presentators[i].name, selectedinstitution.getId());
            presentatorlist.push(pr)
        }
        selectedinstitution.setPresentators(presentatorlist);
        setSelectedPresentatorlist(presentatorlist)
        console.log("fetching presentators done")
    }

    async function fetchRooms(selectedinstitution: Institutions) {
        console.log('fetching rooms')
        let roomlist = [];
        const response = await fetch(`http://localhost:3000/institutions/${selectedinstitution.getId()}/rooms`)
        const rooms = await response.json()
        for (let i = 0; i < rooms.length; i++) {
            let room: Rooms = new Rooms(rooms[i].id, rooms[i].name, rooms[i].isAvailable, selectedinstitution.getId());
            roomlist.push(room)
        }
        selectedinstitution.setRooms(roomlist);
        setSelectedRoomlist(roomlist)
        console.log('fetching rooms done')
    }

    async function fetchTimetableAppointments(selectedttablelist: Timetables[]) {
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

    async function fetchPresentatorAppointments(selectedpresentatorlist: Presentators[]) {
        console.log("fetching presentator appointments")
        console.log(selectedpresentatorlist)
        for (let i = 0; i < selectedpresentatorlist.length; i++) {
            const response = await fetch(`http://localhost:3000/institutions/${selectedpresentatorlist[i].getInstitutionId()}/presentators/${selectedpresentatorlist[i].getId()}/appointments`)
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
            selectedpresentatorlist[i].setAppointments(oneapplist)
        }
    }

    async function fetchRoomAppointments(selectedroomlist: Rooms[]) {
        console.log('fetching room appointments')
        console.log(selectedroomlist)
        for (let i = 0; i < selectedroomlist.length; i++) {
            const response = await fetch(`http://localhost:3000/institutions/${selectedroomlist[i].getInstitutionId()}/rooms/${selectedroomlist[i].getId()}/appointments`)
            const appointments = await response.json()
            console.log(appointments)
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
                console.log(oneapplist)
            }
            selectedroomlist[i].setAppointments(oneapplist)
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
            setSelectedTimetable(null);
            clearlists();
        }
    };


    const handleTimeTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const ttId = e.target.value;
        const timetable = selectedTimetablelist?.find(t => t.getId() === ttId) || null;
        setSelectedPresentator(null);
        setSelectedRoom(null);
        clearlists();
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
        longest([mondayAppointments, tuesdayAppointments, wednesdayAppointments, thursdayAppointments, fridayAppointments]);
        console.log(timetable)
    };

    const handlePresentatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const presId = e.target.value;
        const presentator = selectedPresentatorlist?.find(p => p.getId() === presId) || null;
        setSelectedTimetable(null);
        setSelectedRoom(null);
        clearlists();
        for (let i = 0; i < presentator!.getAppointments()!.length; i++) {
            if (presentator!.getAppointments()![i].getDayOfWeek() === "MONDAY") {
                mondayAppointments.push(presentator!.getAppointments()![i])
            }
            if (presentator!.getAppointments()![i].getDayOfWeek() === "TUESDAY") {
                tuesdayAppointments.push(presentator!.getAppointments()![i])
            }
            if (presentator!.getAppointments()![i].getDayOfWeek() === "WEDNESDAY") {
                wednesdayAppointments.push(presentator!.getAppointments()![i])
            }
            if (presentator!.getAppointments()![i].getDayOfWeek() === "THURSDAY") {
                thursdayAppointments.push(presentator!.getAppointments()![i])
            }
            if (presentator!.getAppointments()![i].getDayOfWeek() === "FRIDAY") {
                fridayAppointments.push(presentator!.getAppointments()![i])
            }
        }
        setSelectedPresentator(presentator);
        longest([mondayAppointments, tuesdayAppointments, wednesdayAppointments, thursdayAppointments, fridayAppointments]);
        console.log(presentator)
    };

    const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const roomId = e.target.value;
        const room = selectedRoomlist?.find(r => r.getId() === roomId) || null;
        setSelectedTimetable(null);
        setSelectedPresentator(null);
        clearlists();
        for (let i = 0; i < room!.getAppointments()!.length; i++) {
            if (room!.getAppointments()![i].getDayOfWeek() === "MONDAY") {
                mondayAppointments.push(room!.getAppointments()![i])
            }
            if (room!.getAppointments()![i].getDayOfWeek() === "TUESDAY") {
                tuesdayAppointments.push(room!.getAppointments()![i])
            }
            if (room!.getAppointments()![i].getDayOfWeek() === "WEDNESDAY") {
                wednesdayAppointments.push(room!.getAppointments()![i])
            }
            if (room!.getAppointments()![i].getDayOfWeek() === "THURSDAY") {
                thursdayAppointments.push(room!.getAppointments()![i])
            }
            if (room!.getAppointments()![i].getDayOfWeek() === "FRIDAY") {
                fridayAppointments.push(room!.getAppointments()![i])
            }
        }
        setSelectedRoom(room);
        longest([mondayAppointments, tuesdayAppointments, wednesdayAppointments, thursdayAppointments, fridayAppointments]);
        console.log(room)
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
            {selectedInstitution && !selectedTimetable && !selectedPresentator && !selectedRoom && (
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
                    {/* <button>Change view</button> */}
                </div>
                <div className="schedule">
                    <div className="day-1 days" >
                        <div className="day-header-mon day-header">Monday</div>
                        <div className="card-container">
                            <AppointmentDay appointments={mondayAppointments!} />
                        </div>
                    </div>
                    <div className="day-2 days">
                        <div className="day-header-tue day-header">Tuesday</div>
                        <div className="card-container">
                            <AppointmentDay appointments={tuesdayAppointments!} />
                        </div>
                    </div>
                    <div className="day-3 days">
                        <div className="day-header-wed day-header">Wednesday</div>
                        <div className="card-container">
                            <AppointmentDay appointments={wednesdayAppointments!} />
                        </div>
                    </div>
                    <div className="day-4 days">
                        <div className="day-header-thu day-header">Thursday</div>
                        <div className="card-container">
                            <AppointmentDay appointments={thursdayAppointments!} />
                        </div>
                    </div>
                    <div className="day-5 days">
                        <div className="day-header-fri day-header">Friday</div>
                        <div className="card-container">
                            <AppointmentDay appointments={fridayAppointments!} />
                        </div>
                    </div>
                </div>
                <div className="sidebar">
                    <strong>Events:</strong>
                    <div className="event-card" title="No events for today!">
                        <h3><b>Nothing :)</b></h3>
                        <div className="event-container">
                            <p>No events for today!</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}