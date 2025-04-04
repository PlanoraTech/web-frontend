import { useEffect, useState } from "react";
import { Appointments } from "../shared/classes/appointments";
import { Institutions } from "../shared/classes/institutions";
import { Presentators } from "../shared/classes/presentators";
import { Rooms } from "../shared/classes/rooms";
import { Timetables } from "../shared/classes/timetables";
import { Nav } from "./Nav";
import { Calendar } from "./Calendar";
import { fetchEvents, fetchTimetables, fetchPresentators, fetchRooms, fetchTimetableAppointments, fetchPresentatorAppointments, fetchRoomAppointments, fetchManageInstitutions, fetchInstitutions, fetchSubjects, fetchUsers } from "../functions/fetches";
import { getData } from "../functions/getData";
import { resetState, setSelectionAndResetAppointments } from "../functions/utils";
import { useNavigate } from "react-router";
import { ManageAppointment } from "./DirectorUI/ManageAppointment";
import { ManageEvent } from "./DirectorUI/ManageEvent";
import { ManagePresentator } from "./DirectorUI/ManagePresentator";
import { ManageRoom } from "./DirectorUI/ManageRoom";
import { ManageSubject } from "./DirectorUI/ManageSubject";
import { ManageTimetable } from "./DirectorUI/ManageTimetable";
import { ManageUser } from "./DirectorUI/ManageUser";

interface Props {
    type: "main" | "manage"
}

export function Main(props: Props) {
    const [institutions, setInstitutions] = useState<Institutions[]>([]);
    const [manageinstitutions, setManageInstitutions] = useState<Institutions[]>([]);
    const [selectedInstitution, setSelectedInstitution] = useState<Institutions | null>(null);
    const [selectedTimetablelist, setSelectedTimetablelist] = useState<Timetables[]>([]);
    const [selectedTimetable, setSelectedTimetable] = useState<Timetables | null>(null);
    const [selectedPresentatorlist, setSelectedPresentatorlist] = useState<Presentators[]>([]);
    const [selectedPresentator, setSelectedPresentator] = useState<Presentators | null>(null);
    const [selectedRoomlist, setSelectedRoomlist] = useState<Rooms[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Rooms | null>(null);
    const [selectedAppointments, setSelectedAppointments] = useState<Appointments[]>([]);
    const [showAppointments, setShowAppointments] = useState<boolean>(false);
    const [actiontype, setActiontype] = useState<string | null>(null);
    const [actionadd, setActionadd] = useState<string | null>(null);
    const [actionupdate, setActionupdate] = useState<string | null>(null);
    const [error, setError] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        if (props.type == "manage" && localStorage.getItem('role') !== "DIRECTOR") {
            window.location.href = "/timetables";
        }
        getInstitutions();
    }, []);

    useEffect(() => {
        if (selectedInstitution) {
            gettimetables(selectedInstitution!);
            getpresentators(selectedInstitution!);
            getrooms(selectedInstitution!);
            fetchEvents(selectedInstitution!);
            if (props.type === "manage") {
                fetchUsers(selectedInstitution!);
                fetchSubjects(selectedInstitution!);
            }
        }
    }, [selectedInstitution]);

    useEffect(() => {
        if (selectedTimetable) {
            getTiemtableAppointments();
        }
    }, [selectedTimetable]);

    useEffect(() => {
        if (selectedPresentator) {
            getPresentatorAppointments();
        }
    }, [selectedPresentator]);

    useEffect(() => {
        if (selectedRoom) {
            getRoomAppointments();
        }
    }, [selectedRoom]);

    async function getInstitutions() {
        if (props.type === "main") {
            let inslist = await fetchInstitutions();
            setInstitutions(inslist)
        } else {
            let instlist = await fetchManageInstitutions();
            setManageInstitutions(instlist!);
        }
    }

    async function gettimetables(selectedinstitution: Institutions) {
        await getData(fetchTimetables, setSelectedTimetablelist, selectedinstitution);
    }

    async function getpresentators(selectedinstitution: Institutions) {
        await getData(fetchPresentators, setSelectedPresentatorlist, selectedinstitution);
    }

    async function getrooms(selectedinstitution: Institutions) {
        await getData(fetchRooms, setSelectedRoomlist, selectedinstitution);
    }

    async function getTiemtableAppointments() {
        let appointments = await fetchTimetableAppointments(selectedTimetable!, selectedInstitution!);
        setSelectedAppointments(appointments!);
    }

    async function getPresentatorAppointments() {
        let appointments = await fetchPresentatorAppointments(selectedPresentator!, selectedInstitution!);
        setSelectedAppointments(appointments!);
    }
    async function getRoomAppointments() {
        let appointments = await fetchRoomAppointments(selectedRoom!, selectedInstitution!);
        setSelectedAppointments(appointments!);
    }

    const renderErrors = (errors: string[]) => {
        return errors.map((err, index) => <h3 key={index} style={{ color: '#fc6464' }} className="choose">{err}</h3>);
    };

    const handleMainInstitutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const chosen_institution = institutions.find(inst => inst.getId() === e.target.value) || null;
        if (chosen_institution?.getAccess() === "PRIVATE" && !localStorage.getItem('token')) {
            navigate("/login");
        } else {
            setSelectedInstitution(chosen_institution!);
            resetState(setSelectedTimetable, setSelectedPresentator, setSelectedRoom, setSelectedAppointments, setError);
        }
    };

    const handleManageInstitutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const institutionId = e.target.value;
        const institution = manageinstitutions!.find(inst => inst.getId() === institutionId) || null;
        setSelectedInstitution(institution);
        setActiontype("");
        setActionadd("");
        setActionupdate("");
        setError([]);
    };

    const handleTimeTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectionAndResetAppointments(selectedTimetablelist, e.target.value, setSelectedTimetable, setSelectedAppointments, setSelectedPresentator, setSelectedRoom, undefined);
    };

    const handlePresentatorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectionAndResetAppointments(selectedPresentatorlist, e.target.value, setSelectedPresentator, setSelectedAppointments, undefined, setSelectedRoom, setSelectedTimetable);
    };

    const handleRoomChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectionAndResetAppointments(selectedRoomlist, e.target.value, setSelectedRoom, setSelectedAppointments, setSelectedPresentator, undefined, setSelectedTimetable);
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
        if (!selectedInstitution || !(actionadd || actionupdate || actiontype)) {
            return null;
        }
        const actionMap: { [key: string]: JSX.Element } = {
            "Add Timetable": <ManageTimetable institution={selectedInstitution!} action="add" />,
            "Add Presentator": <ManagePresentator institution={selectedInstitution!} />,
            "Add Room": <ManageRoom institution={selectedInstitution!} action="add" />,
            "Add Subject": <ManageSubject institution={selectedInstitution!} action="add" />,
            "Add Appointment": <ManageAppointment timetables={selectedTimetablelist!} action="add" />,
            "Add User": <ManageUser institution={selectedInstitution!} action="add" />,
            "Add Event": <ManageEvent institution={selectedInstitution!} action="add" />,
            // Update Actions
            "Update Timetable": <ManageTimetable institution={selectedInstitution!} action="update" />,
            "Update Room": <ManageRoom institution={selectedInstitution!} action="update" />,
            "Update Subject": <ManageSubject institution={selectedInstitution!} action="update" />,
            "Update User": <ManageUser institution={selectedInstitution!} action="update" />,
            "Update Event": <ManageEvent institution={selectedInstitution!} action="update" />
        };
        let selectedAction = actiontype === "Add" ? actionadd : actionupdate;
        if (!selectedAction) {
            return null;
        }
        return actionMap[selectedAction] || null;
    }

    const showManageAppointments = () => {
        setShowAppointments(!showAppointments);
        setActiontype("");
        setActionadd("");
        setActionupdate("");
    }

    return (
        <>
            <Nav />
            {props.type === "main" ? (
                <>
                    {!selectedInstitution && (
                        <h3 className="choose">Choose an institution!</h3>
                    )}
                    {(error.length == 0 || !error) && selectedInstitution && selectedTimetable == null && selectedPresentator == null && selectedRoom == null && (
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
                    {renderErrors(error)}
                    <div id="main">
                        <div className="sidebar">
                            <select onChange={handleMainInstitutionChange} value={selectedInstitution?.getId() || 'default'}>
                                <option value={"default"} disabled>Institutions</option>
                                {institutions.map((institution: Institutions) => (
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
                        <div id="schedule">
                            <Calendar appointments={selectedAppointments!} presentatorlist={selectedInstitution?.getPresentators()!} institution={selectedInstitution!} type={props.type} />
                        </div>
                        <div className="sidebar" id="sidebar_2"></div>
                    </div>
                </>
            ) : (
                <>
                    {renderErrors(error)}
                    <h2 className="choose">Director's menu</h2>
                    <div id="manage_main">
                        <div className="manage_sidebar">
                            <select onChange={handleManageInstitutionChange} value={selectedInstitution?.getId() || 'default'}>
                                <option value={"default"} disabled>Institutions</option>
                                {manageinstitutions && manageinstitutions!.map((institution: Institutions) => (
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
                                    <Calendar appointments={selectedAppointments!} presentatorlist={selectedInstitution?.getPresentators()!} institution={selectedInstitution!} roomlist={selectedInstitution?.getRooms()!} subjectlist={selectedInstitution?.getSubjects()!} type={props.type} />
                                </div>
                            ) : null}
                            {manageAction()}
                        </div>
                        <div className="manage_sidebar" id="manage_sidebar_2">

                        </div>
                    </div>
                </>
            )}
        </>
    )
}