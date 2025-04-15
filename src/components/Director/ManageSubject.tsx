import { useState } from "react";
import { Institutions } from "../../shared/classes/institutions";
import { Subjects } from "../../shared/classes/subjects";
import { getBearerToken } from "../../functions/utils";

interface Props {
    institution: Institutions;
    action: "add" | "update";
}

export function ManageSubject(props: Props) {
    const [subjectname, setSubjectname] = useState<string>("");
    const [subjectid, setSubjectid] = useState<string>("");
    const [subject, setSubject] = useState<Subjects | null>(null);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");


    const handlechangesubject = async () => {
        setError("");
        setSuccess("");
        let change = 'POST';
        let url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/subjects`
        if (props.action === "update") {
            change = 'PATCH';
            url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/subjects/${subject?.getId()}`
        }
        if (subjectname.trim() === "" || subjectid.trim() === "") {
            setError("Please fill in all fields");
            return;
        }
        const response = await fetch(url, {
            method: change,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getBearerToken()}`
            },
            body: JSON.stringify({ name: subjectname, subjectId: subjectid }),
        });
        if (!response.ok) {
            const data = await response.json();
            setError(data.message);
        }
        else {
            props.action === "update" ? setSuccess("Subject updated successfully") : setSuccess("Subject created successfully");
            setSubjectname("");
            setSubjectid("");
            setSubject(null);
        }

    }

    const handleDeleteSubject = async () => {
        if (confirm("Are you sure you want to delete this subject?")) {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/subjects/${subject?.getId()}`, {
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
                setSubjectname("");
                setSubjectid("");
                setSubject(null);
                setSuccess("Subject deleted successfully");
            }
        } else {
            setError("Subject deletion cancelled");
        }
    }

    const handlesubjectchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = props.institution.getSubjects()?.find((sub: Subjects) => sub.getId() === e.target.value);
        if (selected) {
            setSubjectname(selected.getName());
            setSubjectid(selected.getSubjectId());
            setSubject(selected);
            setError("");
            setSuccess("");
        }
    }

    const inputs = () => {
        return (
            <>
                <label>Subject Name: </label><br />
                <input placeholder="Name:" type="text" value={subjectname} onChange={(e) => setSubjectname(e.target.value)} /><br />
                <label>Subject Id: </label><br />
                <input placeholder="Id:" type="text" value={subjectid} onChange={(e) => setSubjectid(e.target.value)} /><br />
            </>
        )
    }

    return (
        <div className="form-container">
            <h2>{props.action === "update" ? "Update" : "Add"} Subject</h2>
            <div className="form-div">
                {
                    props.action === "update" ? <>
                        <select onChange={handlesubjectchange} value={subject?.getId() || 'default'}>
                            <option value="default" disabled>Subjects</option>
                            {
                                props.institution.getSubjects()?.map((sub: Subjects) => (
                                    <option key={sub.getId()} value={sub.getId()}>{sub.getName()}</option>
                                ))
                            }
                        </select><br />
                        {subject ? <>
                            {inputs()}
                        </> : null}
                    </> : <>
                        {inputs()}
                    </>
                }
                {error && <p id="errors">{error}</p>}
                {success && <p id="success">{success}</p>}
                <div className="button-container">
                    <button onClick={handlechangesubject}>{props.action === "update" ? "Save" : "Create New"} Subject</button>
                    {props.action === "update" && <button onClick={handleDeleteSubject}>Delete Subject</button>}
                </div>
            </div>
        </div>
    )
}