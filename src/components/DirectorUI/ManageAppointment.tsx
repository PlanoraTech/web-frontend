import { useEffect, useState } from "react";
import { Timetables } from "../../shared/classes/timetables";

interface Props {
    timetables: Timetables[];
    action: "add" | "update";
}

export function ManageAppointment(props: Props) {
    const [selectedTimetable, setSelectedTimetable] = useState<Timetables | null>(null);
    const [start, setStart] = useState<string>("");
    const [end, setEnd] = useState<string>("");
    const [iscancelled, setIscancelled] = useState<string>("");
    const [subjectid, setSubjectid] = useState<string>("");
    const [error, setError] = useState<string>("");

    let baseUrl = 'https://planora-dfce142fac4b.herokuapp.com/institutions';
    let localUrl = 'http://localhost:3000/institutions';

    const handleTimeTableChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const timetable = props.timetables.find((tt: Timetables) => tt.getId() === e.target.value);
        setSelectedTimetable(timetable!);
    }

    const handlecreateappointment = async () => {
        if (start === "" || end === "" || iscancelled === "" || subjectid === "" || !selectedTimetable) {
            setError("Please fill in all fields ");
        } else if (start >= end) {
            setError("End date should be after start date ");
        } else if (start < new Date().toISOString()) {
            setError("Start date should be in the future ");
        } else if (iscancelled.toLowerCase() !== "yes" && iscancelled.toLowerCase() !== "no") {
            setError("Cancelled should be yes or no ");
        } else {
            let cancel: boolean;
            iscancelled === "yes" ? cancel = true : cancel = false;
            console.log({ start: start, end: end, iscancelled: cancel, subjectid: subjectid })
            const response = await fetch(`${baseUrl}/${selectedTimetable!.getInstitutionId()}/timetables/${selectedTimetable!.getId()}/appointments/?token=${localStorage.getItem("token")}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ start: start, end: end, iscancelled: cancel, subjectid: subjectid }),
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            }
            else {
                console.log(response);
                setError("");
                setStart("");
                setEnd("");
                setIscancelled("");
                setSubjectid("");
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
                <input placeholder="Start:" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} required /><br />
                <label>End date: </label><br />
                <input placeholder="End:" type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} required /><br />
                <label>Cancelled? </label><br />
                <input placeholder="Cancelle? Yes or No:" type="text" value={iscancelled} onChange={(e) => setIscancelled(e.target.value)} required /><br />
                <label>Subject id: </label><br />
                <input placeholder="Subject id:" type="text" value={subjectid} onChange={(e) => setSubjectid(e.target.value)} required /><br />
                <p id="errors">{error}</p>
                <div className="button-container">
                    <button onClick={handlecreateappointment}>Create New Appointment</button>
                </div>
            </div>
        </div>
    )
}