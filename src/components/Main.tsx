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
import { ManageAppointment } from "./Director/ManageAppointment";
import { ManageEvent } from "./Director/ManageEvent";
import { ManagePresentator } from "./Director/ManagePresentator";
import { ManageRoom } from "./Director/ManageRoom";
import { ManageSubject } from "./Director/ManageSubject";
import { ManageTimetable } from "./Director/ManageTimetable";
import { ManageUser } from "./Director/ManageUser";
import { InstitutionSelect } from "./InstitutionSelect";
import { AppointmentSelects } from "./AppointmentSelects";

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
        return errors.map((err, index) => <h3 key={index} id="errors" className="choose">{err}</h3>);
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
        resetState(setSelectedTimetable, setSelectedPresentator, setSelectedRoom, setSelectedAppointments, setError);
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
            "Add Appointment": <ManageAppointment timetables={selectedTimetablelist!} subjectlist={selectedInstitution.getSubjects()!} action="add" presentatorlist={selectedInstitution.getPresentators()!} roomlist={selectedInstitution.getRooms()!} />,
            "Add User": <ManageUser institution={selectedInstitution!} action="add" />,
            "Add Event": <ManageEvent institution={selectedInstitution!} action="add" />,
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

    function renderActionSelect(type: "Add" | "Update", onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void, value: string | null) {
        const options = type === "Add"
            ? ["Add Timetable", "Add Presentator", "Add Room", "Add Subject", "Add Event", "Add Appointment", "Add User"]
            : ["Update Timetable", "Update Room", "Update Subject", "Update Event", "Update User"];

        return (
            <select onChange={onChange} value={value || "default"}>
                <option value="default" disabled>{type} Actions</option>
                {options.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
            </select>
        );
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
                        <h3 className="choose">{selectedTimetable.getName()} - '{selectedTimetable.getVersion()}'</h3>
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
                            <InstitutionSelect institutions={institutions} selectedInstitution={selectedInstitution} handleMainInstitutionChange={handleMainInstitutionChange} />
                            {selectedInstitution ?
                                <AppointmentSelects handleTimeTableChange={handleTimeTableChange} selectedTimetable={selectedTimetable} selectedTimetablelist={selectedTimetablelist}
                                    handlePresentatorChange={handlePresentatorChange} selectedPresentator={selectedPresentator} selectedPresentatorlist={selectedPresentatorlist}
                                    handleRoomChange={handleRoomChange} selectedRoom={selectedRoom} selectedRoomlist={selectedRoomlist}
                                />
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
                            <InstitutionSelect institutions={manageinstitutions} selectedInstitution={selectedInstitution} handleMainInstitutionChange={handleManageInstitutionChange} />
                            {selectedInstitution ? (
                                <>
                                    <button onClick={showManageAppointments}>Appointments</button>
                                    {showAppointments ?
                                        <AppointmentSelects handleTimeTableChange={handleTimeTableChange} selectedTimetable={selectedTimetable} selectedTimetablelist={selectedTimetablelist}
                                            handlePresentatorChange={handlePresentatorChange} selectedPresentator={selectedPresentator} selectedPresentatorlist={selectedPresentatorlist}
                                            handleRoomChange={handleRoomChange} selectedRoom={selectedRoom} selectedRoomlist={selectedRoomlist}
                                        />
                                        : null}
                                    <select onChange={handleActionChange} value={actiontype! || "default"}>
                                        <option value={"default"} disabled>Options</option>
                                        <option>Add</option>
                                        <option>Update</option>
                                    </select>
                                    {actiontype === "Add" && renderActionSelect("Add", handleAddActionChange, actionadd)}
                                    {actiontype === "Update" && renderActionSelect("Update", handleUpdateActionChange, actionupdate)}
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