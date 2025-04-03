import { useEffect, useState } from "react";
import { Institutions } from "../../shared/classes/institutions";
import { Subjects } from "../../shared/classes/subjects";

interface Props {
    institution: Institutions;
    action: "add" | "update";
}

export function ManageSubject(props: Props) {
    const [subjectname, setSubjectname] = useState<string>("");
    const [subjectid, setSubjectid] = useState<string>("");
    const [subject, setSubject] = useState<Subjects | null>(null);
    const [action, setAction] = useState<"add" | "update">("add");
    const [error, setError] = useState<string>("");
    let token = localStorage.getItem('token');

    useEffect(() => {
        if (props.action === "update") {
            setAction("update");
        }
    }, [subject])

    const handlechangesubject = async () => {
        let change = 'POST';
        let url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/subjects`
        if (action === "update") {
            change = 'PATCH';
            url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/subjects/${subject?.getId()}`
        }
        if (subjectname === "" || subjectid === "") {
            setError("Please fill in all fields");
        } else {
            const response = await fetch(url, {
                method: change,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: subjectid, subjectname: subjectname }),
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            }
            else {
                console.log(response);
                setError("");
                setSubjectname("");
                setSubjectid("");
            }
        }
    }

    const handlesubjectchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const subject = props.institution.getSubjects()?.find((sub: Subjects) => sub.getId() === e.target.value);
        setSubjectname(subject!.getName());
        setSubjectid(subject!.getSubjectId());
        setSubject(subject!);
    }

    return (
        <div className="form-container">
            <h2>{action === "update" ? "Update" : "Add"} Subject</h2>
            <div className="form-div">
                {
                    action === "update" ? <>
                        <select onChange={handlesubjectchange} value={subject?.getId() || 'default'}>
                            <option value="default" disabled>Subjects</option>
                            {
                                props.institution.getSubjects()?.map((sub: Subjects) => (
                                    <option key={sub.getId()} value={sub.getId()}>{sub.getName()}</option>
                                ))
                            }
                        </select><br />
                        <label>Subject Name: </label><br />
                        <input placeholder="Name:" type="text" value={subjectname} onChange={(e) => setSubjectname(e.target.value)} /><br />
                        <label>Subject Id: </label><br />
                        <input placeholder="Id:" type="text" value={subjectid} onChange={(e) => setSubjectid(e.target.value)} /><br />
                    </> : <>
                        <label>Subject Name: </label><br />
                        <input placeholder="Name:" type="text" value={subjectname} onChange={(e) => setSubjectname(e.target.value)} /><br />
                        <label>Subject Id: </label><br />
                        <input placeholder="Id:" type="text" value={subjectid} onChange={(e) => setSubjectid(e.target.value)} /><br />
                    </>
                }
                <p id="errors">{error}</p>
                <div className="button-container">
                    <button onClick={handlechangesubject}>{action === "update" ? "Save" : "Create New"} Subject</button>
                </div>
            </div>
        </div>
    )
}