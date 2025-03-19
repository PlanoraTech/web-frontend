import { useEffect, useState } from "react";
import { Appointments } from "../shared/classes/appointments";
import { Presentators } from "../shared/classes/presentators";
import { Rooms } from "../shared/classes/rooms";
import { getTimeWithZeros } from "../functions/getTimeWithZeros";
import { Subjects } from "../shared/classes/subjects";
import { Select } from "./Select";
import ReactDOM from "react-dom";

interface Props {
    appointment: Appointments;
    presentatorlist: Presentators[];
    roomlist: Rooms[];
    subjectlist: Subjects[];
    show: boolean;
    type: 'main' | 'manage';
    x: number;
    y: number;
}

export function AppointmentPopOver(props: Props) {
    const [close, setClose] = useState(false);
    const [subject, setSubject] = useState(props.appointment.getSubject()?.getName());
    const [rooms, setRooms] = useState(props.appointment.getRooms());
    const [start, setStart] = useState<string>(props.appointment.getStart().toISOString());
    const [end, setEnd] = useState<string>(props.appointment.getEnd().toISOString());
    const [presentators, setPresentators] = useState(props.appointment.getPresentators());
    const [selectedRooms, setSelectedRooms] = useState<{ id: string, element: JSX.Element }[]>([]);
    const [selectedPresentators, setSelectedPresentators] = useState<{ id: string, element: JSX.Element }[]>([]);
    const [_, setUpdate] = useState(false);


    useEffect(() => {
        console.log(props.show);
        if (props.show) {
            setClose(false);
        }
    }, []);

    const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const subject = props.subjectlist?.find((subject: Subjects) => subject.getId() === e.target.value);
        setSubject(subject!.getName());
    }

    const deleteOption = (id: string) => {
        setSelectedRooms(selectedRooms.filter(room => room.id !== id));
        setSelectedPresentators(selectedPresentators.filter(pres => pres.id !== id))
    }

    const deleteDefaults = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (e.currentTarget.parentElement) {
            let id = e.currentTarget.parentElement.id;
            if (!id) return;
            props.appointment.getRooms()?.map((room) => {
                if (room.getId() === id) {
                    const updatedRooms = props.appointment.getRooms()?.filter(room => room.getId() !== id);
                    props.appointment.setRooms(updatedRooms!);
                }
            });
            props.appointment.getPresentators()?.map((pres) => {
                if (pres.getId() === id) {
                    const updatedPresentators = props.appointment.getPresentators()?.filter(pres => pres.getId() !== id)
                    props.appointment.setPresentators(updatedPresentators!);

                }
            });
            setUpdate(prev => !prev);
        }
    }

    const addRoomSelect = () => {
        console.log('addRoomSelect');
        const id = `room_${selectedRooms.length + 1}`;
        const newRoom = {
            id,
            element: (
                <div key={id} id={id}>
                    <select defaultValue={"default"}>
                        <option value="default">Select a room</option>
                        {props.roomlist.map((room: Rooms) => (
                            <option key={room.getId()} value={room.getId()}>{room.getName()}</option>
                        ))}
                    </select>
                    <button className="close" onClick={() => deleteOption(id)}><b>✕</b></button>
                </div>
            )
        };
        setSelectedRooms([...selectedRooms, newRoom]);
    }

    const addPresentatorSelect = () => {
        const id = `pres_${selectedPresentators.length + 1}`;
        const newPresentator = {
            id,
            element: (
                <div key={id} id={id}>
                    <select defaultValue={"default"}>
                        <option value="default">Select a presentator</option>
                        {props.presentatorlist.map((pres: Presentators) => (
                            <option key={pres.getId()} value={pres.getId()}>{pres.getName()}</option>
                        ))}
                    </select>
                    <button className="close" onClick={() => deleteOption(id)}><b>✕</b></button>
                </div>
            )
        };
        setSelectedPresentators([...selectedPresentators, newPresentator]);
    }

    const formatDateForInput = (date: Date) => {
        if (!date) return "";
        const pad = (num: number) => num.toString().padStart(2, "0");
        const year = date.getFullYear();
        const month = pad(date.getMonth() + 1);
        const day = pad(date.getDate());
        const hours = pad(date.getHours());
        const minutes = pad(date.getMinutes());
        return `${year}-${month}-${day}T${hours}:${minutes}`;
    };

    const prettyDate = (date: Date) => {
        const formattedDate = date.toLocaleString("en-GB", {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
        return formattedDate;
    }

    const removeall = () => {
        const room = document.getElementById('popover_rooms');
        const pres = document.getElementById('popover_rooms');
        if (room) {
            while (room.firstChild) {
                room.removeChild(room.firstChild);
            }
        }
        if (pres) {
            while (pres.firstChild) {
                pres.removeChild(pres.firstChild);
            }
        }
        setTimeout(() => setClose(false), 100); // 🔥 Most zárjuk be a Popovert
    }

    return (
        <>
            <div className="popover" style={{ display: close ? "none" : "block", top: props.y, left: props.x }}>
                <button className="close" onClick={() => {
                    setClose(!close)
                    setSelectedPresentators([])
                    setSelectedRooms([])
                    removeall
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
                                <p>{props.appointment.getRooms()?.map(room => room.getName()).join(", ")}</p>
                                <label><b>Presentator(s):</b></label>
                                <p>{props.appointment.getPresentators()?.map(pres => pres.getName()).join(", ")}</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="popover_content">
                                <div className="popover_header">
                                    <h3>{props.appointment.getSubject()?.getName()}</h3>
                                    <select onChange={handleSubjectChange} value={props.appointment.getSubject()?.getId() || subject}>
                                        {props.subjectlist?.map((subject: Subjects) => (
                                            <option key={subject.getId()} value={subject.getId()}>{subject.getName()}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="popover_body">
                                    <div id="popover_rooms">
                                        <p>{props.appointment.getRooms()?.map(room => room.getName()).join(", ")}</p>
                                        {
                                            props.appointment.getRooms()?.map(room => (
                                                <div key={room.getId()} id={room.getId()}>
                                                    <select key={room.getId()} value={room.getId()}>
                                                        {props.roomlist.map((room: Rooms) => (
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
                                    <input type="datetime-local" onChange={(e) => setStart(e.target.value)} value={formatDateForInput(props.appointment.getStart())} />
                                    <p>{prettyDate(props.appointment.getEnd())}</p>
                                    <input type="datetime-local" onChange={(e) => setEnd(e.target.value)} value={formatDateForInput(props.appointment.getEnd())} />
                                    <div id="popover_presentators">
                                        <p>{props.appointment.getPresentators()?.map(pres => pres.getName()).join(", ")}</p>
                                        {
                                            props.appointment!.getPresentators()?.map(pres => (
                                                <div key={pres.getId()} id={pres.getId()}>
                                                    <select key={pres.getId()} value={pres.getId()}>
                                                        {props.presentatorlist.map((pres: Presentators) => (
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
                                    <div className="button-container">
                                        <button>Save</button>
                                    </div>
                                </div>
                            </div>
                        </>
                    )
                }

            </div>
        </>
    )
}