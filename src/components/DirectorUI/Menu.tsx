import { useEffect, useState } from "react"
import { Nav } from "../Nav"
import { Institutions } from "../../shared/classes/institutions"
import { ManageTimetable } from "./ManageTimetable";
import { ManagePresentator } from "./ManagePresentator";
import { ManageRoom } from "./ManageRoom";
import { ManageAppointment } from "./ManageAppointment";
import { ManageSubject } from "./ManageSubject";
import { fetchManageInstitutions, fetchTimetables, fetchPresentators, fetchSubjects, fetchRooms, fetchPresentatorAppointments, fetchTimetableAppointments, fetchRoomAppointments, fetchUsers } from "../../functions/fetches";
import { Timetables } from "../../shared/classes/timetables";
import { Presentators } from "../../shared/classes/presentators";
import { Testcalendar } from "../Testcalendar";
import { Appointments } from "../../shared/classes/appointments";
import { Rooms } from "../../shared/classes/rooms";
import { ManageUser } from "./ManageUser";

export function Menu() {
    const [institutions, setInstitutions] = useState<Institutions[]>([]);
    const [selectedinstitution, setSelectedInstitution] = useState<Institutions | null>(null);
    const [selectedTimetablelist, setSelectedTimetablelist] = useState<Timetables[]>([]);
    const [selectedTimetable, setSelectedTimetable] = useState<Timetables | null>(null);
    const [selectedPresentatorlist, setSelectedPresentatorlist] = useState<Presentators[] | null>(null);
    const [selectedPresentator, setSelectedPresentator] = useState<Presentators | null>(null);
    const [selectedRoomlist, setSelectedRoomlist] = useState<Rooms[] | null>(null);
    const [selectedRoom, setSelectedRoom] = useState<Rooms | null>(null);
    const [selectedAppointments, setSelectedAppointments] = useState<Appointments[] | null>(null);
    const [actiontype, setActiontype] = useState<string | null>(null);
    const [actionadd, setActionadd] = useState<string | null>(null);
    const [actionupdate, setActionupdate] = useState<string | null>(null);

    useEffect(() => {
        getinstitutions();
    }, [])

    useEffect(() => {
        gettimetables(selectedinstitution!);
        getpresentators(selectedinstitution!);
        fetchSubjects(selectedinstitution!);
        getrooms(selectedinstitution!);
        fetchUsers(selectedinstitution!);
    }, [selectedinstitution])

    useEffect(() => {
        fetchTimetableAppointments(selectedTimetablelist!, selectedinstitution!);
    }, [selectedTimetablelist]);

    useEffect(() => {
        fetchPresentatorAppointments(selectedPresentatorlist!, selectedinstitution!);
    }, [selectedPresentatorlist]);

    useEffect(() => {
        fetchRoomAppointments(selectedRoomlist!, selectedinstitution!);
    }, [selectedRoomlist]);

    async function getinstitutions() {
        let instlist = await fetchManageInstitutions();
        setInstitutions(instlist);
    }

    async function gettimetables(selectedinstitution: Institutions) {
        let timetablelist = (await fetchTimetables(selectedinstitution)).timetablelist;
        setSelectedTimetablelist(timetablelist);
    }

    async function getpresentators(selectedinstitution: Institutions) {
        let presentatorlist = await fetchPresentators(selectedinstitution);
        setSelectedPresentatorlist(presentatorlist);
    }

    async function getrooms(selectedinstitution: Institutions) {
        let roomlist = await fetchRooms(selectedinstitution);
        setSelectedRoomlist(roomlist);
    }

    const handleInstitutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const institutionId = e.target.value;
        const institution = institutions!.find(inst => inst.getId() === institutionId) || null;
        setSelectedInstitution(institution);
        setActiontype("");
        setActionadd("");
        setActionupdate("");
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

    const handleactionchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const action = e.target.value;
        setActiontype(action);
        setActionadd("");
        setActionupdate("");
    }

    const handleaddactionchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const action = e.target.value;
        setActionadd(action);
    }

    const handleupdateactionchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const action = e.target.value;
        setActionupdate(action);
    }

    function manageAction() {
        if (selectedinstitution && actionadd || actionupdate || actiontype) {
            switch (actionadd) {
                case "Add Timetable":
                    return <ManageTimetable institution={selectedinstitution!} action="add" />
                case "Add Presentator":
                    return <ManagePresentator institution={selectedinstitution!} action="add" />
                case "Add Room":
                    return <ManageRoom institution={selectedinstitution!} action="add" />
                case "Add Subject":
                    return <ManageSubject institution={selectedinstitution!} action="add" />
                case "Add Appointment":
                    return <ManageAppointment timetables={selectedTimetablelist!} action="add" />
                case "Add User":
                    return <ManageUser institution={selectedinstitution!} action="add" />
                default:
                    break;
            }
            switch (actionupdate) {
                case "Update Timetable":
                    return <ManageTimetable institution={selectedinstitution!} action="update" />
                case "Update Presentator":
                    return <ManagePresentator institution={selectedinstitution!} action="update" />
                case "Update Room":
                    return <ManageRoom institution={selectedinstitution!} action="update" />
                case "Update Subject":
                    return <ManageSubject institution={selectedinstitution!} action="update" />
                case "Update User":
                    return <ManageUser institution={selectedinstitution!} action="update" />
                default:
                    break;
            }
            if (actiontype == "Manage Appointments") {
                return (
                    <div className="calendar_div">
                        <Testcalendar appointments={selectedAppointments!} presentatorlist={selectedinstitution?.getPresentators()!} institution={selectedinstitution!} type="manage" />
                    </div>
                )
            }
        }
    }

    return (
        <div>
            <Nav />
            <h2 className="choose">Director's menu</h2>
            <div id="manage_main">
                <div className="manage_sidebar">
                    <select onChange={handleInstitutionChange} value={selectedinstitution?.getId() || 'default'}>
                        <option value={"default"} disabled>Institutions</option>
                        {institutions!.map((institution: Institutions) => (
                            <option key={institution.getId()} value={institution.getId()}>{institution.getName()}</option>
                        ))}
                    </select><br />
                    {selectedinstitution ? (
                        <>
                            <select onChange={handleactionchange} value={actiontype! || "default"}>
                                <option value={"default"} disabled>Options</option>
                                <option>Add</option>
                                <option>Update</option>
                                <option>Manage Appointments</option>
                            </select>
                            {actiontype === "Add" ? (
                                <>
                                    <select onChange={handleaddactionchange} value={actionadd! || "default"}>
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
                                    <select onChange={handleupdateactionchange} value={actionupdate! || "default"}>
                                        <option value={"default"} disabled>Update Actions</option>
                                        <option>Update Timetable</option>
                                        <option>Update Presentator</option>
                                        <option>Update Room</option>
                                        <option>Update Subject</option>
                                        <option>Update Event</option>
                                        <option>Update User</option>
                                        {/* <option>Update Appointment</option> */}
                                    </select>
                                </>
                            ) : null}
                            {actiontype === "Manage Appointments" ?
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
                        </>
                    ) : null}
                </div>
                <div id="manage_schedule">
                    {manageAction()}
                </div>
                <div className="manage_sidebar" id="manage_sidebar_2">

                </div>
            </div>
        </div>
    )
}