import { useEffect, useState } from "react"
import { Nav } from "../Nav"
import { Institutions } from "../../shared/classes/institutions"
import { ManageTimetable } from "./ManageTimetable";
import { ManagePresentator } from "./ManagePresentator";
import { ManageRoom } from "./ManageRoom";
import { ManageAppointment } from "./ManageAppointment";
import { ManageSubject } from "./ManageSubject";
import { fetchManageInstitutions, fetchTimetables, fetchPresentators, fetchSubjects, fetchRooms, fetchPresentatorAppointments, fetchTimetableAppointments, fetchRoomAppointments, fetchUsers, fetchEvents } from "../../functions/fetches";
import { Timetables } from "../../shared/classes/timetables";
import { Presentators } from "../../shared/classes/presentators";
import { Calendar } from "../Calendar";
import { Appointments } from "../../shared/classes/appointments";
import { Rooms } from "../../shared/classes/rooms";
import { ManageUser } from "./ManageUser";
import { ManageEvent } from "./ManageEvent";

export function Menu() {
    const [institutions, setInstitutions] = useState<Institutions[]>([]);
    const [selectedInstitution, setselectedInstitution] = useState<Institutions | null>(null);
    const [selectedTimetablelist, setSelectedTimetablelist] = useState<Timetables[]>([]);
    const [selectedTimetable, setSelectedTimetable] = useState<Timetables | null>(null);
    const [selectedPresentatorlist, setSelectedPresentatorlist] = useState<Presentators[] | null>(null);
    const [selectedPresentator, setSelectedPresentator] = useState<Presentators | null>(null);
    const [selectedRoomlist, setSelectedRoomlist] = useState<Rooms[] | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Rooms | null>(null);
    const [selectedAppointments, setSelectedAppointments] = useState<Appointments[] | null>(null);
    const [showAppointments, setShowAppointments] = useState<boolean>(false);
    const [actiontype, setActiontype] = useState<string | null>(null);
    const [actionadd, setActionadd] = useState<string | null>(null);
    const [actionupdate, setActionupdate] = useState<string | null>(null);
    const [error, setError] = useState<string[]>([]);

    useEffect(() => {
        async function load() {
            await getInstitutions();
        }
        load();
        if (localStorage.getItem('role') !== "DIRECTOR") {
            window.location.href = "/timetables";
        }
    }, [])

    useEffect(() => {
        getTimetables(selectedInstitution!);
        getPresentators(selectedInstitution!);
        fetchSubjects(selectedInstitution!);
        getRooms(selectedInstitution!);
        fetchUsers(selectedInstitution!);
        fetchEvents(selectedInstitution!);
    }, [selectedInstitution])

    useEffect(() => {
        fetchTimetableAppointments(selectedTimetablelist!, selectedInstitution!);
    }, [selectedTimetablelist]);

    useEffect(() => {
        fetchPresentatorAppointments(selectedPresentatorlist!, selectedInstitution!);
    }, [selectedPresentatorlist]);

    useEffect(() => {
        fetchRoomAppointments(selectedRoomlist!, selectedInstitution!);
    }, [selectedRoomlist]);

    async function getInstitutions() {
        let instlist = await fetchManageInstitutions();
        setInstitutions(instlist!);
    }

    async function getTimetables(selectedInstitution: Institutions) {
        let timetablelist = await fetchTimetables(selectedInstitution);
        try {
            setSelectedTimetablelist(timetablelist!.timetables!);
        } catch (error) { }
    }

    async function getPresentators(selectedInstitution: Institutions) {
        let presentatorlist = await fetchPresentators(selectedInstitution);
        try {
            setSelectedPresentatorlist(presentatorlist!.presentators);
            for (let i = 0; i < presentatorlist!.error.length; i++) {
                error.push(presentatorlist!.error[i]);
            }
        } catch (error) { }
    }

    async function getRooms(selectedInstitution: Institutions) {
        let roomlist = await fetchRooms(selectedInstitution);
        try {
            setSelectedRoomlist(roomlist!.rooms);
            for (let i = 0; i < roomlist!.error.length; i++) {
                error.push(roomlist!.error[i]);
            }
        } catch (error) { }
    }

    const handleInstitutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const institutionId = e.target.value;
        const institution = institutions!.find(inst => inst.getId() === institutionId) || null;
        setselectedInstitution(institution);
        setActiontype("");
        setActionadd("");
        setActionupdate("");
        setError([]);
    };

    const handleTimeTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAppointments([]);
        const ttId = e.target.value;
        const timetable = selectedTimetablelist?.find(t => t.getId() === ttId) || null;
        setSelectedPresentator(null);
        setSelectedRoom(null);
        setSelectedTimetable(timetable);
        setSelectedAppointments(timetable!.getAppointments()!);
    };

    const handlePresentatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedAppointments([]);
        const presId = e.target.value;
        const presentator = selectedPresentatorlist?.find(p => p.getId() === presId) || null;
        setSelectedTimetable(null);
        setSelectedRoom(null);
        setSelectedPresentator(presentator);
        setSelectedAppointments(presentator!.getAppointments()!);
    };

    const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const roomId = e.target.value;
        const room = selectedRoomlist?.find(r => r.getId() === roomId) || null;
        setSelectedTimetable(null);
        setSelectedPresentator(null);
        setSelectedRoom(room);
        setSelectedAppointments(room!.getAppointments()!);
    }

    const handleActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const action = e.target.value;
        setActiontype(action);
        setActionadd("");
        setActionupdate("");
        setShowAppointments(false);
    }

    const handleAddActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const action = e.target.value;
        setActionadd(action);
        setShowAppointments(false);
    }

    const handleUpdateActionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const action = e.target.value;
        setActionupdate(action);
        setShowAppointments(false);
    }

    function manageAction() {
        if (selectedInstitution && actionadd || actionupdate || actiontype) {
            switch (actionadd) {
                case "Add Timetable":
                    return <ManageTimetable institution={selectedInstitution!} action="add" />
                case "Add Presentator":
                    return <ManagePresentator institution={selectedInstitution!} />
                case "Add Room":
                    return <ManageRoom institution={selectedInstitution!} action="add" />
                case "Add Subject":
                    return <ManageSubject institution={selectedInstitution!} action="add" />
                case "Add Appointment":
                    return <ManageAppointment timetables={selectedTimetablelist!} action="add" />
                case "Add User":
                    return <ManageUser institution={selectedInstitution!} action="add" />
                case "Add Event":
                    return <ManageEvent institution={selectedInstitution!} action="add" />
                default:
                    break;
            }
            switch (actionupdate) {
                case "Update Timetable":
                    return <ManageTimetable institution={selectedInstitution!} action="update" />
                case "Update Room":
                    return <ManageRoom institution={selectedInstitution!} action="update" />
                case "Update Subject":
                    return <ManageSubject institution={selectedInstitution!} action="update" />
                case "Update User":
                    return <ManageUser institution={selectedInstitution!} action="update" />
                case "Update Event":
                    return <ManageEvent institution={selectedInstitution!} action="update" />
                default:
                    break;
            }
        }
    }

    const showManageAppointments = () => {
        setShowAppointments(!showAppointments);
        setActiontype("");
        setActionadd("");
        setActionupdate("");
    }

    return (
        <div>
            <Nav />
            {error && error.map((err, index) => (
                <h3 key={index} style={{ color: '#fc6464' }} className="choose">{err}</h3>
            ))}
            <h2 className="choose">Director's menu</h2>
            <div id="manage_main">
                <div className="manage_sidebar">
                    <select onChange={handleInstitutionChange} value={selectedInstitution?.getId() || 'default'}>
                        <option value={"default"} disabled>Institutions</option>
                        {institutions && institutions!.map((institution: Institutions) => (
                            <option key={institution.getId()} value={institution.getId()}>{institution.getName()}</option>
                        ))}
                    </select><br />
                    {selectedInstitution ? (
                        <>
                            <button onClick={showManageAppointments}>Appointments</button>
                            {showAppointments ?
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
                            <select onChange={handleActionChange} value={actiontype! || "default"}>
                                <option value={"default"} disabled>Options</option>
                                <option>Add</option>
                                <option>Update</option>
                            </select>
                            {actiontype === "Add" ? (
                                <>
                                    <select onChange={handleAddActionChange} value={actionadd! || "default"}>
                                        <option value={"default"} disabled>Add Actions</option>
                                        <option>Add Timetable</option>
                                        <option>Add Presentator</option>
                                        <option>Add Room</option>
                                        <option>Add Subject</option>
                                        <option>Add Event</option>
                                        <option>Add Appointment</option>
                                        <option>Add User</option>
                                    </select>
                                </>
                            ) : null}
                            {actiontype === "Update" ? (
                                <>
                                    <select onChange={handleUpdateActionChange} value={actionupdate! || "default"}>
                                        <option value={"default"} disabled>Update Actions</option>
                                        <option>Update Timetable</option>
                                        <option>Update Room</option>
                                        <option>Update Subject</option>
                                        <option>Update Event</option>
                                        <option>Update User</option>
                                    </select>
                                </>
                            ) : null}
                        </>
                    ) : null}
                </div>
                <div id="manage_schedule">
                    {showAppointments ? (
                        <div className="calendar_div">
                            <Calendar appointments={selectedAppointments!} presentatorlist={selectedInstitution?.getPresentators()!} institution={selectedInstitution!} roomlist={selectedInstitution?.getRooms()!} subjectlist={selectedInstitution?.getSubjects()!} type="manage" />
                        </div>
                    ) : null}
                    {manageAction()}
                </div>
                <div className="manage_sidebar" id="manage_sidebar_2">

                </div>
            </div>
        </div>
    )
}