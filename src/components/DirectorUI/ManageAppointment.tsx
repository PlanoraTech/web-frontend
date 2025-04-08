import { useState } from "react";
import { Timetables } from "../../shared/classes/timetables";
import { Subjects } from "../../shared/classes/subjects";
import { formatDateForInput } from "../../functions/formatDateForInput";

interface Props {
    timetables: Timetables[];
    subjectlist: Subjects[];
    action: "add" | "update";
}

export function ManageAppointment(props: Props) {
    const [selectedTimetable, setSelectedTimetable] = useState<Timetables | null>(null);
    const [start, setStart] = useState<string>(new Date(Date.now()).toISOString());
    const [end, setEnd] = useState<string>(new Date(Date.now()).toISOString());
    const [subject, setSubject] = useState<Subjects | null>(null);
    const [error, setError] = useState<string>("");
    let token = localStorage.getItem("token");

    const handleTimeTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const timetable = props.timetables.find((tt: Timetables) => tt.getId() === e.target.value);
        setSelectedTimetable(timetable!);
    }

    const handlecreateappointment = async () => {
        console.log(start, end, selectedTimetable, subject);
        if (start === "" || end === "" || !selectedTimetable || !subject) {
            setError("Please fill in all fields ");
        } else if (start >= end) {
            setError("End date should be after start date ");
        } else if (start < new Date().toISOString()) {
            setError("Start date should be in the future ");
        } else if (end < new Date().toISOString()) {
            setError("End date should be in the future ");
        } else {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${selectedTimetable!.getInstitutionId()}/timetables/${selectedTimetable!.getId()}/appointments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ start: start, end: end, subjectId: subject?.getId() }),
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            }
            else {
                console.log(response);
                setError("Appointment created successfully");
                setStart("");
                setEnd("");
                setSubject(null);
                setSelectedTimetable(null);
            }
        }
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
                <label>Subject id: </label><br />
                <select onChange={(e) => setSubject(props.subjectlist?.find((subject: Subjects) => subject.getId() === e.target.value) || null)} value={subject?.getId() || 'default'} required>
                    <option value="default" disabled>Subjects</option>
                    {props.subjectlist?.map((subject: Subjects) => (
                        <option key={subject.getId()} value={subject.getId()}>{subject.getName()}</option>
                    ))}
                </select>
                <p id="errors">{error}</p>
                <div className="button-container">
                    <button onClick={handlecreateappointment}>Create New Appointment</button>
                </div>
            </div>
        </div>
    )
}