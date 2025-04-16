import { useState } from "react";
import { Institutions } from "../../shared/classes/institutions";
import { Timetables } from "../../shared/classes/timetables";
import { getBearerToken } from "../../functions/utils";

interface Props {
    institution: Institutions;
    action: "add" | "update";
}

export function ManageTimetable(props: Props) {
    const [ttname, setTtname] = useState<string>("");
    const [ttversion, setTtversion] = useState<string>("");
    const [timetable, setTimetable] = useState<Timetables | null>(null);
    const [clone, setClone] = useState<boolean>(false);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");


    const handlechangetimetable = async () => {
        setError("");
        setSuccess("");
        if (!clone) {
            let change = 'POST';
            let url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/timetables`
            if (props.action === "update") {
                change = 'PATCH';
                url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/timetables/${timetable?.getId()}`
            }
            if (ttname.trim() === "") {
                setError("Please fill in all fields");
                return;
            }
            const response = await fetch(url, {
                method: change,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getBearerToken()}`
                },
                body: JSON.stringify(ttversion.trim() === "" ? { name: ttname } : { name: ttname, version: ttversion }),
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            }
            else {
                props.action === "update" ? setSuccess("Timetable updated successfully") : setSuccess("Timetable created successfully");
                setTtname("");
                setTtversion("");
                setTimetable(null);
            }

        } else {
            cloneTimetable();
        }
    }

    async function cloneTimetable() {
        setError("");
        setSuccess("");
        let body: { name: string, version: string } = {
            name: ttname,
            version: ttversion
        };
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/timetables/${timetable?.getId()}/clone`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getBearerToken()}`
            },
            body: JSON.stringify((ttname == timetable?.getName() && ttversion == timetable?.getVersion()) ? {} : body),
        });
        if (!response.ok) {
            const data = await response.json();
            setError(data.message);
        }
        else {
            setSuccess("Timetable cloned successfully");
            setTtname("");
            setTtversion("");
            setTimetable(null);
        }
    }

    const handletimetablechange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const timetable = props.institution.getTimetables()?.find((tt: Timetables) => tt.getId() === e.target.value);
        setTtname(timetable!.getName());
        setTtversion(timetable!.getVersion());
        setTimetable(timetable!);
    }

    const handleDeleteTimetable = async () => {
        setError("");
        setSuccess("");
        if (confirm("Are you sure you want to delete this timetable?")) {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/timetables/${timetable?.getId()}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getBearerToken()}`
                },
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            }
            else {
                setSuccess("Timetable deleted successfully");
                setTtname("");
                setTtversion("");
                setTimetable(null);
            }
        } else {
            setError("Timetable deletion cancelled");
        }
    }

    const nameInputs = (
        <>
            <label>Timetable Name:</label><br />
            <input placeholder="Name" type="text" value={ttname} onChange={e => setTtname(e.target.value)} /><br />
        </>
    );

    const buttonLabel = clone ? "Clone" : props.action === "update" ? "Save" : "Create New";

    const changeCloneSetting = () => {
        setClone(!clone);
        setTtname("");
        setTtversion("");
        setTimetable(null);
        setError("");
        setSuccess("");
    }

    return (
        <div className="form-container">
            <h2>{clone ? "Clone" : (props.action === "update" ? "Update" : "Add")} Timetable</h2>
            <div className="form-div">
                {
                    props.action === "update" || clone ?
                        <>
                            <select onChange={handletimetablechange} value={timetable?.getId() || 'default'}>
                                <option value="default" disabled>Timetables</option>
                                {props.institution.getTimetables()?.map((tt: Timetables) => (
                                    <option key={tt.getId()} value={tt.getId()}>{tt.getName()} - '{tt.getVersion()}'</option>
                                ))}
                            </select><br />
                            {
                                timetable ? <>
                                    {nameInputs}
                                    <label>Version: </label><br />
                                    <input placeholder="Name:" type="text" value={ttversion} onChange={(e) => setTtversion(e.target.value)} /><br />
                                </> : null
                            }
                        </> : nameInputs
                }
                {error && <p id="errors">{error}</p>}
                {success && <p id="success">{success}</p>}
                <div className="button-container">
                    <button onClick={handlechangetimetable}>{buttonLabel} Timetable</button>
                    {props.action === "add" ? <button onClick={changeCloneSetting}>Clone Timetable?</button> : null}
                    {props.action === "update" ? <button onClick={handleDeleteTimetable}>Delete Timetable</button> : null}
                </div>
            </div>
        </div>
    )
}