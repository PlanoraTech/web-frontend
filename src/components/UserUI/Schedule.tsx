import { useNavigate } from "react-router";
import { Institutions } from "../../shared/classes/institutions";
import { useEffect, useState } from "react";
import { Presentators } from "../../shared/classes/presentators";
import { Rooms } from "../../shared/classes/rooms";
import { Timetables } from "../../shared/classes/timetables";
import { Appointments } from "../../shared/classes/appointments";
import { fetchTimetables, fetchPresentators, fetchRooms, fetchEvents, fetchTimetableAppointments, fetchPresentatorAppointments, fetchRoomAppointments } from "../../functions/fetches";
import { Calendar } from "../Calendar";
import { getData } from "../../functions/getData";
import { resetState, setSelectionAndResetAppointments } from "../../functions/utils";

interface ScheduleProps {
    institution: Institutions[];
}

export function Schedule(props: ScheduleProps) {
    const [selectedInstitution, setSelectedInstitution] = useState<Institutions | null>(null);
    const [selectedTimetablelist, setSelectedTimetablelist] = useState<Timetables[]>([]);
    const [selectedTimetable, setSelectedTimetable] = useState<Timetables | null>(null);
    const [selectedPresentatorlist, setSelectedPresentatorlist] = useState<Presentators[]>([]);
    const [selectedPresentator, setSelectedPresentator] = useState<Presentators | null>(null);
    const [selectedRoomlist, setSelectedRoomlist] = useState<Rooms[]>([]);
    const [selectedRoom, setSelectedRoom] = useState<Rooms | null>(null);
    const [selectedAppointments, setSelectedAppointments] = useState<Appointments[]>([]);
    const [error, setError] = useState<string[]>([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (selectedInstitution) {
            gettimetables(selectedInstitution!);
            getpresentators(selectedInstitution!);
            getrooms(selectedInstitution!);
            fetchEvents(selectedInstitution!);
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

    const handleInstitutionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const chosen_institution = props.institution.find(inst => inst.getId() === e.target.value) || null;
        if (chosen_institution?.getAccess() === "PRIVATE" && !localStorage.getItem('token')) {
            navigate("/login");
        } else {
            setSelectedInstitution(chosen_institution!);
            resetState(setSelectedTimetable, setSelectedPresentator, setSelectedRoom, setSelectedAppointments, setError);  // Resetelés
        }
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

    return (
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
            {error && error.map((err, index) => (
                <h3 key={index} style={{ color: '#fc6464' }} className="choose">{err}</h3>
            ))}
            <div id="main">
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
                <div id="schedule">
                    <Calendar appointments={selectedAppointments!} presentatorlist={selectedInstitution?.getPresentators()!} institution={selectedInstitution!} type="main" />
                </div>
                <div className="sidebar" id="sidebar_2"></div>
            </div>
        </>
    )
}