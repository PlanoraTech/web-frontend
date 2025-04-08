import { useState } from "react";
import { Institutions } from "../../shared/classes/institutions";
import { Timetables } from "../../shared/classes/timetables";

interface Props {
    institution: Institutions;
    action: "add" | "update";
}

export function ManageTimetable(props: Props) {
    const [ttname, setTtname] = useState<string>("");
    const [timetable, setTimetable] = useState<Timetables | null>(null);
    const [error, setError] = useState<string>("");
    let token = localStorage.getItem('token');


    const handlechangetimetable = async () => {
        let change = 'POST';
        let url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/timetables`
        if (props.action === "update") {
            change = 'PATCH';
            url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/timetables/${timetable?.getId()}`
        }
        if (ttname === "") {
            setError("Please fill in all fields");
        } else {
            const response = await fetch(url, {
                method: change,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: ttname }),
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            }
            else {
                console.log(response);
                props.action === "update" ? setError("Timetable updated successfully") : setError("Timetable created successfully");
                setTtname("");
            }
        }
    }

    const handletimetablechange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const timetable = props.institution.getTimetables()?.find((tt: Timetables) => tt.getId() === e.target.value);
        setTtname(timetable!.getName());
        setTimetable(timetable!);
    }

    const handleDeleteTimetable = async () => {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/timetables/${timetable?.getId()}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            const data = await response.json();
            setError(data.message);
        }
        else {
            console.log(response);
            setError("Timetable deleted successfully");
            setTtname("");
        }
    }

    return (
        <div className="form-container">
            <h2>{props.action === "update" ? "Update" : "Add"} Timetable</h2>
            <div className="form-div">
                {
                    props.action === "update" ?
                        <>
                            <select onChange={handletimetablechange} value={timetable?.getId() || 'default'}>
                                <option value="default" disabled>Timetables</option>
                                {props.institution.getTimetables()?.map((tt: Timetables) => (
                                    <option key={tt.getId()} value={tt.getId()}>{tt.getName()}</option>
                                ))}
                            </select><br />
                            {
                                timetable ? <><label>Timetable Name: </label><br />
                                    <input placeholder="Name:" type="text" value={ttname} onChange={(e) => setTtname(e.target.value)} /><br /></> : null
                            }
                        </> : <>
                            <label>Timetable Name: </label><br />
                            <input placeholder="Name:" type="text" value={ttname} onChange={(e) => setTtname(e.target.value)} /><br />
                        </>
                }
                <p id="errors">{error}</p>
                <div className="button-container">
                    <button onClick={handlechangetimetable}>{props.action === "update" ? "Save" : "Create New"} Timetable</button>
                    {props.action === "update" ? <button onClick={handleDeleteTimetable}>Delete Timetable</button> : null}
                </div>
            </div>
        </div>
    )
}