import { useEffect, useState } from "react";
import { Appointments } from "../shared/classes/appointments";
import { Presentators } from "../shared/classes/presentators";
import { Rooms } from "../shared/classes/rooms";
import { getTimeWithZeros } from "../functions/getTimeWithZeros";
import { Subjects } from "../shared/classes/subjects";
import ReactDOM from "react-dom";
import { fetchAvailablePresentators, fetchAvailableRooms } from "../functions/fetches";
import { formatDateForInput } from "../functions/formatDateForInput";
import { getBearerToken } from "../functions/utils";

interface Props {
    appointment: Appointments;
    presentatorlist: Presentators[];
    roomlist: Rooms[];
    subjectlist: Subjects[];
    show: boolean;
    type: 'main' | 'manage' | 'presentator';
    x: number;
    y: number;
    onClose: (appointment: Appointments | null) => void;
    new?: boolean;
}

export function PopOver(props: Props) {
    const [subject, setSubject] = useState<Subjects>(props.appointment.getSubject()!);
    const [defaultRooms, setDefaultRooms] = useState<Rooms[]>([...props.appointment.getRooms()!]);
    const [defaultPresentators, setDefaultPresentators] = useState<Presentators[]>([...props.appointment.getPresentators()!]);
    const [rooms, setRooms] = useState<Rooms[]>([]);
    const [presentators, setPresentators] = useState<Presentators[]>([]);
    const [start, setStart] = useState<string>(props.appointment.getStart().toString());
    const [end, setEnd] = useState<string>(props.appointment.getEnd().toString());
    const [selectedRooms, setSelectedRooms] = useState<{ id: string, element: JSX.Element }[]>([]);
    const [selectedPresentators, setSelectedPresentators] = useState<{ id: string, element: JSX.Element }[]>([]);
    const [selectElementSet, setSelectElementSet] = useState<{ id: string, elementId: string }[]>([]);
    const [availableRooms, setAvailableRooms] = useState<Rooms[]>([]);
    const [availablePresentators, setAvailablePresentators] = useState<Presentators[]>([]);
    const [_, setUpdate] = useState(false);
    const [error, setError] = useState<string[]>([]);
    const [success, setSuccess] = useState<string>("");

    useEffect(() => {
        if (props.type == 'manage') {
            getAvailablePresentators();
        }
        getAvailableRooms();
        setSelectedRooms([]);
        setSelectedPresentators([]);
        const default_rooms = props.appointment.getRooms();
        const default_presentators = props.appointment.getPresentators();
        if (rooms && default_rooms) setDefaultRooms([...default_rooms]);
        if (presentators && default_presentators) setDefaultPresentators([...default_presentators]);
        setPresentators([]);
        setRooms([]);
        setError([]);
    }, [props.appointment, props.type]);

    async function getAvailableRooms() {
        const availablerooms = await fetchAvailableRooms(props.appointment, props.appointment.getInstitutionId()!);
        if (availablerooms) {
            setAvailableRooms(availablerooms);
        }
    }

    async function getAvailablePresentators() {
        const availablepresentators = await fetchAvailablePresentators(props.appointment, props.appointment.getInstitutionId()!);
        if (availablepresentators) {
            setAvailablePresentators(availablepresentators);
        }
    }

    const saveAppointment = async () => {
        if (JSON.stringify(getAllPresentators()) != JSON.stringify(props.appointment.getPresentators()) || JSON.stringify(getAllRooms()) != JSON.stringify(props.appointment.getRooms())) {
            changeAppointmentPart('presentators')
            changeAppointmentPart('rooms')
        }
        if (new Date(start).toString() != props.appointment.getStart().toString() || new Date(end).toString() != props.appointment.getEnd().toString() || subject != props.appointment.getSubject()) {
            changeTimeAndSubject()
        }
    };

    const handledeleteappointment = async () => {
        let url = `${import.meta.env.VITE_BASE_URL}/${props.appointment.getInstitutionId()!}/${JSON.parse(props.appointment!.getOrigin()!).type!}/${JSON.parse(props.appointment!.getOrigin()!).id!}/appointments/${props.appointment!.getId()!}`;
        if (confirm("Are you sure you want to delete this appointment?")) {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getBearerToken()}`
                },
            });
            if (!response.ok) {
                const data = await response.json();
                setError([`${data.message}`]);
            }
            else {
                setSuccess("Appointment deleted successfully!");
                setTimeout(() => {
                    removeall();
                    props.onClose(null);
                }, 3000);
            }
        } else {
            setError(["Appointment deletion cancelled!"]);
        }
    }

    async function changeAppointmentPart(type: 'rooms' | 'presentators') {
        const isRooms = type === 'rooms';
        const getAll = isRooms ? getAllRooms() : getAllPresentators();
        const getOriginal = isRooms ? props.appointment.getRooms() : props.appointment.getPresentators();
        const getChanged = isRooms ? getChangedRooms() : getChangedPresentators();
        const updateAppointment = isRooms ? updateAppointmentRooms() : updateAppointmentPresentators();
        const getAvailable = isRooms ? getAvailableRooms() : getAvailablePresentators();
        const url = `${import.meta.env.VITE_BASE_URL}/${props.appointment.getInstitutionId()!}/${JSON.parse(props.appointment!.getOrigin()!).type!}/${JSON.parse(props.appointment!.getOrigin()!).id!}/appointments/${props.appointment!.getId()!}/${type}`;
        if (JSON.stringify(getAll) === JSON.stringify(getOriginal)) {
            setError(["No changes made!"]);
            return;
        }
        if (getAll.length === 0) {
            setError([`Please select at least one ${type.slice(0, -1)}!`]);
            return;
        }
        if (props.appointment.getStart() < new Date()) {
            setError(["You cannot change past appointments!"]);
            return;
        }
        const response = await fetch(url, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getBearerToken()}`
            },
            body: JSON.stringify(getChanged),
        });
        if (!response.ok) {
            const data = await response.json();
            setError([`${data.message}`]);
        } else {
            getAvailable;
            if (type === 'rooms' && props.type === 'presentator') {
                setSuccess("Rooms changed successfully!");
            } else {
                props.new ? setSuccess("Appointment created successfully!") : setSuccess("Appointment saved successfully!");
            }
            updateAppointment;
        }
    }

    const changeTimeAndSubject = async () => {
        if (subject == props.appointment.getSubject() && start == props.appointment.getStart().toISOString() && end == props.appointment.getEnd().toISOString() && JSON.stringify(getAllRooms()) == JSON.stringify(props.appointment.getRooms()) && JSON.stringify(getAllPresentators()) == JSON.stringify(props.appointment.getPresentators())) {
            setError(["No changes made!"]);
        } else if (start >= end) {
            setError(["End date should be after start date!"]);
        } else if (props.appointment.getStart() < new Date()) {
            setError(["You cannot change past appointments!"]);
        } else {
            if (error.length == 0) {
                let url = `${import.meta.env.VITE_BASE_URL}/${props.appointment.getInstitutionId()!}/${JSON.parse(props.appointment!.getOrigin()!).type!}/${JSON.parse(props.appointment!.getOrigin()!).id!}/appointments/${props.appointment!.getId()!}`;
                const response = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getBearerToken()}`
                    },
                    body: JSON.stringify({ start: start, end: end, subject: subject }),
                });
                if (!response.ok) {
                    const data = await response.json();
                    setError([`${data.message}`]);
                } else {
                    props.new ? setSuccess("Appointment created successfully!") : setSuccess("Appointment saved successfully!");
                    updateAppointmentTimeAndSubject();
                }
            } else {
                setError([...error, "Please resolve the issues to save the appointment!"])
            }
        }
    }

    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSubject(props.subjectlist?.find((subject: Subjects) => subject.getId() === e.target.value)!);
    };

    const addRoomSelect = () => {
        const id = `room_${selectedRooms.length + 1}`;
        const newRoom = {
            id,
            element: (
                <div key={id} id={id}>
                    <select defaultValue={"default"} onChange={(e) => {
                        if (rooms.find(room => room.getId() === e.target.value) || defaultRooms.find(room => room.getId() === e.target.value)) {
                            setError(["Room already added"]);
                        } else {
                            setError([]);
                            rooms.push((!props.new ? availableRooms : availableRooms)!.find(room => room.getId() === e.target.value)!);
                            setRooms(rooms);
                            selectElementSet.push({ id: id, elementId: e.target.value })
                        }
                    }}>
                        <option value="default">Select a room</option>
                        {(!props.new ? availableRooms : availableRooms)!.map((room: Rooms) => (
                            <option key={room.getId()} value={room.getId()}>{room.getName()}</option>
                        ))}
                    </select>
                    <button className="close" onClick={() => deleteOption(id)}><b>✕</b></button>
                </div>
            )
        };
        setSelectedRooms([...selectedRooms, newRoom]);
    };

    const addPresentatorSelect = () => {
        const id = `pres_${selectedPresentators.length + 1}`;
        const newPresentator = {
            id,
            element: (
                <div key={id} id={id}>
                    <select defaultValue={"default"} onChange={(e) => {
                        if (presentators.find(pres => pres.getId() === e.target.value) || defaultPresentators.find(pres => pres.getId() === e.target.value)) {
                            setError(["Presentator already added"]);
                        } else {
                            setError([]);
                            presentators.push((!props.new ? availablePresentators : availablePresentators)!.find(pres => pres.getId() === e.target.value)!);
                            setPresentators(presentators);
                            selectElementSet.push({ id: id, elementId: e.target.value })
                        }
                    }}>
                        <option value="default">Select a presentator</option>
                        {(!props.new ? availablePresentators : availablePresentators)!.map((pres: Presentators) => (
                            <option key={pres.getId()} value={pres.getId()}>{pres.getName()}</option>
                        ))}
                    </select>
                    <button className="close" onClick={() => deleteOption(id)}><b>✕</b></button>
                </div>
            ),
        };
        setSelectedPresentators([...selectedPresentators, newPresentator]);
    };

    const prettyDate = (date: Date) => {
        return new Intl.DateTimeFormat("en-HU", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        }).format(date);
    };

    function getAllPresentators(): Presentators[] {
        let existing_presentators: Presentators[] = [...defaultPresentators];
        for (let i = 0; i < presentators.length; i++) {
            existing_presentators.push(presentators[i]);
        }
        return existing_presentators;
    }

    function getAllRooms(): Rooms[] {
        let existing_rooms: Rooms[] = [...defaultRooms];
        for (let i = 0; i < rooms.length; i++) {
            existing_rooms.push(rooms[i]);
        }
        return existing_rooms;
    }

    function getChangedRooms(): { id: string; }[] {
        let rooms: { id: string; }[] = [];
        getAllRooms().forEach((room) => {
            rooms.push({ id: room.getId() });
        })
        return rooms;
    }

    function getChangedPresentators(): { id: string; }[] {
        let presentators: { id: string; }[] = [];
        getAllPresentators().forEach((pres) => {
            presentators.push({ id: pres.getId() });
        })
        return presentators;
    }

    const deleteOption = (id: string) => {
        if (id.startsWith("room")) {
            setSelectedRooms(selectedRooms.filter(room => room.id !== id));
            let room = rooms.find(room => room.getId() === selectElementSet.find(elem => elem.id === id)!.elementId);
            rooms.splice(rooms.indexOf(room!), 1);
        } else {
            setSelectedPresentators(selectedPresentators.filter(pres => pres.id !== id));
            let pres = presentators.find(pres => pres.getId() === selectElementSet.find(elem => elem.id === id)!.elementId);
            presentators.splice(presentators.indexOf(pres!), 1);
        }
        setError([]);
    };

    const deleteDefaults = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.currentTarget.parentElement) {
            let id = e.currentTarget.parentElement.id;
            if (!id) return;
            const updatedRooms = [...defaultRooms];
            const updatedPresentators = [...defaultPresentators];
            props.appointment.getRooms()?.forEach((room) => {
                if (room.getId() === id) {
                    updatedRooms.splice(updatedRooms.indexOf(room), 1);
                }
            });
            props.appointment.getPresentators()?.forEach((pres) => {
                if (pres.getId() === id) {
                    updatedPresentators.splice(updatedPresentators.indexOf(pres), 1);
                }
            });
            setDefaultRooms(updatedRooms);
            setDefaultPresentators(updatedPresentators);
            setUpdate(prev => !prev);
            setError([]);
        }
    };

    function removeall() {
        setSelectedRooms([]);
        setSelectElementSet([]);
        setSelectedPresentators([]);
        setDefaultRooms([]);
        setDefaultPresentators([]);
        setPresentators([]);
        setRooms([]);
        setError([]);
    }

    function updateAppointmentTimeAndSubject() {
        props.appointment.setStart(start);
        props.appointment.setEnd(end);
        props.appointment.setSubject(subject);
        setStart(props.appointment.getStart().toString());
        setEnd(props.appointment.getEnd().toString());
        setSubject(props.appointment.getSubject()!);
    }
    function updateAppointmentRooms() {
        props.appointment.setRooms(getAllRooms());
        setDefaultRooms(props.appointment.getRooms()!);
        setSelectedRooms([]);
        setRooms([]);
    }
    function updateAppointmentPresentators() {
        props.appointment.setPresentators(getAllPresentators());
        setDefaultPresentators(props.appointment.getPresentators()!);
        setSelectedPresentators([]);
        setPresentators([]);
    }

    return (
        <>
            <div id="popover" style={{ top: props.y, left: props.x }}>
                <button className="close" onClick={() => {
                    removeall();
                    props.onClose(props.appointment);
                }}><b>✕</b></button>
                {
                    props.type == 'main' ? (
                        <div className="popover-content">
                            <div className="popover_header">
                                <h3>{props.appointment.getSubject()?.getName()}</h3>
                            </div>
                            <div className="popover-body">
                                <p style={{ fontSize: '1.1rem' }}>{getTimeWithZeros(props.appointment.getStart())} - {getTimeWithZeros(props.appointment.getEnd())}</p>
                                <label><b>Room(s):</b></label>
                                <p>{props.appointment.getRooms()?.map(room => room.getName()).join(" - ")}</p>
                                <label><b>Presentator(s):</b></label>
                                <p>{props.appointment.getPresentators()?.map(pres => pres.getName()).join(", ")}</p>
                            </div>
                        </div>
                    ) : null
                }
                {
                    props.type == 'manage' ? (
                        <>
                            <div className="popover-content">
                                <div className="popover_header">
                                    <h3>{props.appointment.getSubject()?.getName()}</h3>
                                    <select onChange={handleSubjectChange} value={subject.getId()}>
                                        {props.subjectlist?.map((subject: Subjects) => (
                                            <option key={subject.getId()} value={subject.getId()}>{subject.getName()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="popover-body">
                                    <div id="popover_rooms">
                                        <p>{props.appointment.getRooms()!.length == 0 ? "No rooms added to this appointment" : props.appointment.getRooms()!.map(room => room.getName()).join(" - ")}</p>
                                        {
                                            defaultRooms.map(room => (
                                                <div key={room.getId()} id={room.getId()}>
                                                    <select key={room.getId()} defaultValue={room.getId()} disabled>
                                                        {props.roomlist!.map((room: Rooms) => (
                                                            <option key={room.getId()} value={room.getId()}>{room.getName()}</option>
                                                        ))}
                                                    </select>
                                                    <button className="close" onClick={deleteDefaults}><b>✕</b></button>
                                                </div>
                                            ))
                                        }
                                        {selectedRooms.map(room =>
                                            ReactDOM.createPortal(room.element, document.getElementById("popover_rooms")!)
                                        )}
                                    </div>
                                    <div>
                                        <button className="close" onClick={addRoomSelect}><b>╋</b></button>
                                    </div>
                                    <p>{prettyDate(props.appointment.getStart())}</p>
                                    <input type="datetime-local" onChange={(e) => setStart(e.target.value)} value={formatDateForInput(new Date(start))} />
                                    <p>{prettyDate(props.appointment.getEnd())}</p>
                                    <input type="datetime-local" onChange={(e) => setEnd(e.target.value)} value={formatDateForInput(new Date(end))} />
                                    <div id="popover_presentators">
                                        <p>{props.appointment.getPresentators()!.length == 0 ? "No presentators added to this appointment" : props.appointment.getPresentators()!.map(pres => pres.getName()).join(", ")}</p>
                                        {
                                            defaultPresentators && defaultPresentators.map(pres => (
                                                <div key={pres.getId()} id={pres.getId()}>
                                                    <select key={pres.getId()} defaultValue={pres.getId()} disabled>
                                                        {props.presentatorlist!.map((pres: Presentators) => (
                                                            <option key={pres.getId()} value={pres.getId()}>{pres.getName()}</option>
                                                        ))}
                                                    </select>
                                                    <button className="close" onClick={deleteDefaults}><b>✕</b></button>
                                                </div>
                                            ))
                                        }
                                        {selectedPresentators.map(pres =>
                                            ReactDOM.createPortal(pres.element, document.getElementById("popover_presentators")!)
                                        )}
                                    </div>
                                    <div>
                                        <button className="close" onClick={addPresentatorSelect}><b>╋</b></button>
                                    </div>
                                    {error.map((err, index) => (
                                        <p key={index} id="errors">{err}</p>
                                    ))}
                                    {success && <p id="success">{success}</p>}
                                    <div className="button-container">
                                        <button onClick={saveAppointment}>Save</button>
                                        {!props.new ? <button onClick={handledeleteappointment}>Delete</button> : null}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : null
                }
                {
                    props.type == 'presentator' ? (
                        <>
                            <div className="popover-content">
                                <div className="popover_header">
                                    <h3>{props.appointment.getSubject()?.getName()}</h3>
                                </div>
                                <div className="popover-body">
                                    <div id="popover_rooms">
                                        <p>{props.appointment.getRooms()!.map(room => room.getName()).join(" - ")}</p>
                                        {
                                            defaultRooms && defaultRooms!.map(room => (
                                                <div key={room.getId()} id={room.getId()}>
                                                    <select key={room.getId()} defaultValue={room.getId()} disabled>
                                                        {props.appointment.getRooms()!.map((room: Rooms) => (
                                                            <option key={room.getId()} value={room.getId()}>{room.getName()}</option>
                                                        ))}
                                                    </select>
                                                    <button className="close" onClick={deleteDefaults}><b>✕</b></button>
                                                </div>
                                            ))
                                        }
                                        {selectedRooms.map(room =>
                                            ReactDOM.createPortal(room.element, document.getElementById("popover_rooms")!)
                                        )}
                                    </div>
                                    <div>
                                        <button className="close" onClick={addRoomSelect}><b>╋</b></button>
                                    </div>
                                    <p style={{ fontSize: '1.1rem' }}>{getTimeWithZeros(props.appointment.getStart())} - {getTimeWithZeros(props.appointment.getEnd())}</p>
                                    <div id="popover_presentators">
                                        <p>{props.appointment.getPresentators()!.map(pres => pres.getName()).join(", ")}</p>
                                    </div>
                                    {error.map((err, index) => (
                                        <p key={index} id="errors">{err}</p>
                                    ))}
                                    {success && <p id="success">{success}</p>}
                                    <div className="button-container">
                                        <button onClick={() => changeAppointmentPart('rooms')}>Change room(s)</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : null
                }
            </div>
        </>
    );
}