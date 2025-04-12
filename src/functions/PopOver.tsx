import { useEffect, useState } from "react";
import { Appointments } from "../shared/classes/appointments";
import { Presentators } from "../shared/classes/presentators";
import { Rooms } from "../shared/classes/rooms";
import { getTimeWithZeros } from "./getTimeWithZeros";
import { Subjects } from "../shared/classes/subjects";
import ReactDOM from "react-dom";
import { fetchAvailablePresentators, fetchAvailableRooms } from "./fetches";
import { formatDateForInput } from "./formatDateForInput";

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
    const [start, setStart] = useState<string>(props.appointment.getStart().toISOString());
    const [end, setEnd] = useState<string>(props.appointment.getEnd().toISOString());
    const [selectedRooms, setSelectedRooms] = useState<{ id: string, element: JSX.Element }[]>([]);
    const [selectedPresentators, setSelectedPresentators] = useState<{ id: string, element: JSX.Element }[]>([]);
    const [selectElementSet, setSelectElementSet] = useState<{ id: string, elementId: string }[]>([]);
    const [availableRooms, setAvailableRooms] = useState<Rooms[]>([]);
    const [availablePresentators, setAvailablePresentators] = useState<Presentators[]>([]);
    const [_, setUpdate] = useState(false);
    const [error, setError] = useState<string[]>([]);
    let token = localStorage.getItem('token');

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
        if (subject == props.appointment.getSubject() && start == props.appointment.getStart().toISOString() && end == props.appointment.getEnd().toISOString() && JSON.stringify(getAllPresentators()) == JSON.stringify(props.appointment.getPresentators()) && JSON.stringify(getAllRooms()) == JSON.stringify(props.appointment.getRooms())) {
            setError(["No changes made!"]);
        } else if (getAllPresentators().length == 0 || getAllRooms().length == 0) {
            setError(["Please select at least one presentator and one room!"]);
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
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({ start: start, end: end, presentators: getAllPresentators(), rooms: getAllRooms(), subject: subject }),
                });
                if (!response.ok) {
                    const data = await response.json();
                    setError([`${data.message}`]);
                } else {
                    if (!props.new) {
                        getAvailablePresentators();
                        getAvailableRooms();
                        updateAppointment();
                        setError(["Appointment saved successfully!"]);
                    } else {
                        updateAppointment();
                        setError(["Appointment created successfully!"]);
                    }
                }
            } else {
                setError([...error, "Please resolve the issues to save the appointment!"])
            }
        }
    };

    const handledeleteappointment = async () => {
        let url = `${import.meta.env.VITE_BASE_URL}/${props.appointment.getInstitutionId()!}/${JSON.parse(props.appointment!.getOrigin()!).type!}/${JSON.parse(props.appointment!.getOrigin()!).id!}/appointments/${props.appointment!.getId()!}`;
        if (confirm("Are you sure you want to delete this appointment?")) {
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            });
            if (!response.ok) {
                const data = await response.json();
                setError([`${data.message}`]);
            }
            else {
                setError(["Appointment deleted successfully!"]);
                setTimeout(() => {
                    removeall();
                    props.onClose(null);
                }, 3000);
            }
        } else {
            setError(["Appointment deletion cancelled!"]);
        }
    }

    const changeRooms = async () => {
        let url = `${import.meta.env.VITE_BASE_URL}/${props.appointment.getInstitutionId()!}/${JSON.parse(props.appointment!.getOrigin()!).type!}/${JSON.parse(props.appointment!.getOrigin()!).id!}/appointments/${props.appointment!.getId()!}/rooms`
        if (JSON.stringify(getAllRooms()) == JSON.stringify(props.appointment.getRooms())) {
            setError(["No changes made!"]);
        } else if (getAllRooms().length == 0) {
            setError(["Please select at least one room!"]);
        } else if (props.appointment.getStart() < new Date()) {
            setError(["You cannot change past appointments!"]);
        } else {
            if (error.length == 0) {
                const response = await fetch(url, {
                    method: 'PATCH',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(getChangedRooms()),
                });
                if (!response.ok) {
                    const data = await response.json();
                    setError([`${data.message}`]);
                }
                else {
                    getAvailableRooms();
                    setError(["Rooms changed successfully!"]);
                    props.appointment.setRooms(getAllRooms());
                    setRooms([]);
                    setSelectedRooms([]);
                    setDefaultRooms(props.appointment.getRooms()!);
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
                            rooms.push((!props.new ? availableRooms : props.roomlist)!.find(room => room.getId() === e.target.value)!);
                            setRooms(rooms);
                            selectElementSet.push({ id: id, elementId: e.target.value })
                        }
                    }}>
                        <option value="default">Select a room</option>
                        {(!props.new ? availableRooms : props.roomlist)!.map((room: Rooms) => (
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
                            presentators.push((!props.new ? availablePresentators : props.presentatorlist)!.find(pres => pres.getId() === e.target.value)!);
                            setPresentators(presentators);
                            selectElementSet.push({ id: id, elementId: e.target.value })
                        }
                    }}>
                        <option value="default">Select a presentator</option>
                        {(!props.new ? availablePresentators : props.presentatorlist)!.map((pres: Presentators) => (
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

    function updateAppointment() {
        props.appointment.setStart(start);
        props.appointment.setEnd(end);
        props.appointment.setSubject(subject);
        props.appointment.setRooms(getAllRooms());
        props.appointment.setPresentators(getAllPresentators());
        setSubject(props.appointment.getSubject()!);
        setDefaultPresentators(props.appointment.getPresentators()!);
        setDefaultRooms(props.appointment.getRooms()!);
        setSelectedPresentators([]);
        setSelectedRooms([]);
        setPresentators([]);
        setRooms([]);
    }

    return (
        <>
            <div className="popover" style={{ top: props.y, left: props.x }}>
                <button className="close" onClick={() => {
                    removeall();
                    props.onClose(props.appointment);
                }}><b>✕</b></button>
                {
                    props.type == 'main' ? (
                        <div className="popover_content">
                            <div className="popover_header">
                                <h3>{props.appointment.getSubject()?.getName()}</h3>
                            </div>
                            <div className="popover_body">
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
                            <div className="popover_content">
                                <div className="popover_header">
                                    <h3>{props.appointment.getSubject()?.getName()}</h3>
                                    <select onChange={handleSubjectChange} value={subject.getId()}>
                                        {props.subjectlist?.map((subject: Subjects) => (
                                            <option key={subject.getId()} value={subject.getId()}>{subject.getName()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="popover_body">
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
                            <div className="popover_content">
                                <div className="popover_header">
                                    <h3>{props.appointment.getSubject()?.getName()}</h3>
                                </div>
                                <div className="popover_body">
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
                                    <div className="button-container">
                                        <button onClick={changeRooms}>Change room(s)</button>
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