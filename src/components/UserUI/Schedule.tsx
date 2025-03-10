import { useNavigate } from "react-router";
import { Institutions } from "../../shared/classes/institutions";
import { useEffect, useState } from "react";
import { Presentators } from "../../shared/classes/presentators";
import { Rooms } from "../../shared/classes/rooms";
import { Timetables } from "../../shared/classes/timetables";
import { Appointments } from "../../shared/classes/appointments";
import { fetchTimetables, fetchPresentators, fetchRooms, fetchEvents, fetchTimetableAppointments, fetchPresentatorAppointments, fetchRoomAppointments } from "../../functions/fetches";
import { Testcalendar } from "../Testcalendar";

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
    const [selectedAppointments, setSelectedAppointments] = useState<Appointments[] | null>(null);
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        gettimetables(selectedInstitution!);
        getpresentators(selectedInstitution!);
        getrooms(selectedInstitution!);
        fetchEvents(selectedInstitution!);
    }, [selectedInstitution]);

    useEffect(() => {
        fetchTimetableAppointments(selectedTimetablelist!, selectedInstitution!);
    }, [selectedTimetablelist]);

    useEffect(() => {
        fetchPresentatorAppointments(selectedPresentatorlist!, selectedInstitution!);
    }, [selectedPresentatorlist]);

    useEffect(() => {
        fetchRoomAppointments(selectedRoomlist!, selectedInstitution!);
    }, [selectedRoomlist]);

    async function gettimetables(selectedinstitution: Institutions) {
        let timetablelist = (await fetchTimetables(selectedinstitution)).timetablelist;
        setError((await fetchTimetables(selectedinstitution)).error);
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
        const institution = props.institution.find(inst => inst.getId() === institutionId) || null;
        console.log(institution)
        if (institution?.getAccess() === "PRIVATE" && !localStorage.getItem('token')) {
            navigate("/login");
        } else {
            setSelectedInstitution(institution!);
            setSelectedTimetable(null);
            setSelectedPresentator(null);
            setSelectedRoom(null);
            setSelectedAppointments([]);
        }
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
                    <Testcalendar appointments={selectedAppointments!} presentatorlist={selectedInstitution?.getPresentators()!} institution={selectedInstitution!} type="main" />
                </div>
                <div className="sidebar" id="sidebar_2"></div>
            </div>
        </>
    )
}