import { useEffect, useState } from "react";
import { Institutions } from "../../shared/classes/institutions";
import { Timetables } from "../../shared/classes/timetables";

interface Props {
    institution: Institutions;
    action: "add" | "update";
}

export function ManageTimetable(props: Props) {
    const [ttname, setTtname] = useState<string>("");
    const [timetable, setTimetable] = useState<Timetables | null>(null);
    const [action, setAction] = useState<"add" | "update">("add");
    const [error, setError] = useState<string>("");

    let baseUrl = 'https://planora-dfce142fac4b.herokuapp.com/institutions';
    let localUrl = 'http://localhost:3000/institutions';
    let tokenUrl = `?token=${localStorage.getItem('token')}`;

    useEffect(() => {
        if (props.action === "update") {
            setAction("update");
        }
    }, [timetable])

    const handlechangetimetable = async () => {
        let change = 'POST';
        let url = `${baseUrl}/${props.institution.getId()}/timetables/${tokenUrl}`
        if (action === "update") {
            change = 'PATCH';
            url = `${baseUrl}/${props.institution.getId()}/timetables/${timetable?.getId()}/${tokenUrl}`
        }
        if (ttname === "") {
            setError("Please fill in all fields");
        } else {
            const response = await fetch(url, {
                method: change,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: ttname }),
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            }
            else {
                console.log(response);
                setError("");
                setTtname("");
            }
        }
    }

    const handletimetablechange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const timetable = props.institution.getTimetables()?.find((tt: Timetables) => tt.getId() === e.target.value);
        setTtname(timetable!.getName());
        setTimetable(timetable!);
    }

    return (
        <div className="form-container">
            <h2>{action === "update" ? "Update" : "Add"} Timetable</h2>
            <div className="form-div">
                {
                    action === "update" ?
                        <>
                            <select onChange={handletimetablechange} value={timetable?.getId() || 'default'}>
                                <option value="default" disabled>Timetables</option>
                                {props.institution.getTimetables()?.map((tt: Timetables) => (
                                    <option key={tt.getId()} value={tt.getId()}>{tt.getName()}</option>
                                ))}
                            </select><br />
                            <label>Timetable Name: </label><br />
                            <input placeholder="Name:" type="text" value={ttname} onChange={(e) => setTtname(e.target.value)} /><br />
                        </> : <>
                            <label>Timetable Name: </label><br />
                            <input placeholder="Name:" type="text" value={ttname} onChange={(e) => setTtname(e.target.value)} /><br />
                        </>
                }
                <p id="errors">{error}</p>
                <div className="button-container">
                    <button onClick={handlechangetimetable}>{action === "update" ? "Save" : "Create New"} Timetable</button>
                </div>
            </div>
        </div>
    )
}