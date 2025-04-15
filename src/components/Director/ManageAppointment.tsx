import { useEffect, useRef, useState } from "react";
import { Timetables } from "../../shared/classes/timetables";
import { Subjects } from "../../shared/classes/subjects";
import { formatDateForInput } from "../../functions/formatDateForInput";
import { Appointments } from "../../shared/classes/appointments";
import { Presentators } from "../../shared/classes/presentators";
import { Rooms } from "../../shared/classes/rooms";
import ReactDOM from "react-dom";
import { PopOver } from "../PopOver";
import { getBearerToken } from "../../functions/utils";

interface Props {
    timetables: Timetables[];
    presentatorlist: Presentators[];
    roomlist: Rooms[];
    subjectlist: Subjects[];
    action: "add" | "update";
}

export function ManageAppointment(props: Props) {
    const [appointment, setAppointment] = useState<Appointments | null>(null);
    const [selectedTimetable, setSelectedTimetable] = useState<Timetables | null>(null);
    const [start, setStart] = useState<string>(new Date(Date.now()).toISOString());
    const [end, setEnd] = useState<string>(new Date(Date.now()).toISOString());
    const [subject, setSubject] = useState<Subjects | null>(null);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");
    const [showpopover, setPopover] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (ref.current) {
            const { width, height } = ref.current.getBoundingClientRect();
            const centerX = (window.innerWidth - width) / 2;
            const centerY = (window.innerHeight - height) / 2;
            setPosition({ x: centerX, y: centerY - 300 });
        }
    }, []);

    const handleTimeTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const timetable = props.timetables.find((tt: Timetables) => tt.getId() === e.target.value);
        setSelectedTimetable(timetable!);
    }

    const handlecreateappointment = async () => {
        setError("");
        setSuccess("");
        const validationError = validateTimeFields(start, end);
        if (validationError) {
            setError(validationError);
            return;
        }
        if (!selectedTimetable || !subject) {
            setError("Please fill in all fields ");
        } else {
            if (error == "") {
                const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${selectedTimetable!.getInstitutionId()}/timetables/${selectedTimetable!.getId()}/appointments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getBearerToken()}`
                    },
                    body: JSON.stringify({ start: start, end: end, subjectId: subject?.getId() }),
                });
                if (!response.ok) {
                    const data = await response.json();
                    setError(data.message);
                }
                else {
                    const data = await response.json();
                    let presentators: Presentators[] = [];
                    let rooms: Rooms[] = [];
                    let app = new Appointments(data.id, subject!, presentators, rooms, new Date(start), new Date(end), false);
                    app.setOrigin(JSON.stringify({ type: "timetables", id: selectedTimetable.getId() }));
                    app.setInstitutionId(selectedTimetable!.getInstitutionId()!);
                    setAppointment(app);
                    setSuccess("Appointment created successfully");
                    handleshowpopover(app);
                    console.log(start, end);
                    console.log(app.getStart(), app.getEnd());
                    console.log(new Date(start), new Date(end));
                }
            } 
        }
    }

    function handleshowpopover(appointment: Appointments) {
        if (appointment != null) {
            setPopover(true);
        }
    }

    const handleClosePopover = (appointment: Appointments | null) => {
        if (!appointment || appointment.getPresentators()!.length == 0 || appointment.getRooms()!.length == 0) {
            setError("You need to add at least one presentator and one room to the appointment");
        } else {
            setPopover(false);
            resetForm();
        }
    };

    function resetForm() {
        setStart(new Date(Date.now()).toString());
        setEnd(new Date(Date.now()).toString());
        setSelectedTimetable(null);
        setSubject(null);
        setError("");
        setSuccess("");
        setAppointment(null);
    }

    function validateTimeFields(start: string, end: string): string | null {
        const now = new Date().toISOString();
        if (!start || !end) return "Please fill in all fields.";
        if (start >= end) return "End date should be after start date.";
        if (start < now) return "Start date should be in the future.";
        if (end < now) return "End date should be in the future.";
        return null;
    }

    return (
        <div className="form-container">
            <h2>Add Appointment</h2>
            <div className="form-div">
                <label>Select a timetable: </label><br />
                <select onChange={handleTimeTableChange} value={selectedTimetable?.getId() || 'default'} required>
                    <option value="default" disabled>TimeTables</option>
                    {props.timetables?.map((tt: Timetables) => (
                        <option key={tt.getId()} value={tt.getId()}>{tt.getName()}</option>
                    ))}
                </select><br />
                <label>Start date: </label><br />
                <input placeholder="Start:" type="datetime-local" value={formatDateForInput(new Date(start))} onChange={(e) => setStart(e.target.value)} required /><br />
                <label>End date: </label><br />
                <input placeholder="End:" type="datetime-local" value={formatDateForInput(new Date(end))} onChange={(e) => setEnd(e.target.value)} required /><br />
                <label>Subject: </label><br />
                <select onChange={(e) => setSubject(props.subjectlist?.find((subject: Subjects) => subject.getId() === e.target.value) || null)} value={subject?.getId() || 'default'} required>
                    <option value="default" disabled>Subjects</option>
                    {props.subjectlist?.map((subject: Subjects) => (
                        <option key={subject.getId()} value={subject.getId()}>{subject.getName()}</option>
                    ))}
                </select>
                <div id="add_necessary_stuff" ref={ref}>

                </div>
                {showpopover && (
                    ReactDOM.createPortal(
                        <PopOver
                            appointment={appointment!}
                            presentatorlist={props.presentatorlist!}
                            roomlist={props.roomlist!}
                            subjectlist={props.subjectlist!}
                            show={showpopover}
                            type={"manage"}
                            x={position.x}
                            y={position.y}
                            onClose={handleClosePopover}
                            new={true}
                        />,
                        document.getElementById("add_necessary_stuff")!
                    )
                )}
                {error && <p id="errors">{error}</p>}
                {success && <p id="success">{success}</p>}
                <div className="button-container">
                    <button onClick={handlecreateappointment}>Create New Appointment</button>
                </div>
            </div>
        </div>
    )
}