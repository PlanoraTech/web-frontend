import { useEffect, useState } from "react";
import { Institutions } from "../../shared/classes/institutions";
import { Presentators } from "../../shared/classes/presentators";
import { getTokenUrl } from "../../functions/getTokenUrl";

interface Props {
    institution: Institutions;
    action: "add" | "update";
}

export function ManagePresentator(props: Props) {
    const [presname, setPresname] = useState<string>("");
    const [presentator, setpresentator] = useState<Presentators | null>(null);
    const [action, setAction] = useState<"add" | "update">("add");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (props.action === "update") {
            setAction("update");
        }
    }, [presentator])

    const handlechangepresentator = async () => {
        let change = 'POST';
        let url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/presentators/${getTokenUrl()}`
        if (action === "update") {
            change = 'PATCH';
            url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/presentators/${presentator?.getId()}/${getTokenUrl()}`
        }
        if (presname === "") {
            setError("Please fill in all fields");
        } else {
            const response = await fetch(url, {
                method: change,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: presname }),
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            }
            else {
                console.log(response);
                setError("");
                setPresname("");
            }
        }
    }

    const handlepresentatorchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const presentator = props.institution.getPresentators()?.find((pres: Presentators) => pres.getId() === e.target.value);
        setPresname(presentator!.getName());
        setpresentator(presentator!);
    }

    return (
        <div className="form-container">
            <h2>{action === "update" ? "Update" : "Add"} Presentator</h2>
            <div className="form-div">
                {
                    action === "update" ?
                        <>
                            <select onChange={handlepresentatorchange} value={presentator?.getId() || 'default'}>
                                <option value="default" disabled>Presentators</option>
                                {props.institution.getPresentators()?.map((pres: Presentators) => (
                                    <option key={pres.getId()} value={pres.getId()}>{pres.getName()}</option>
                                ))}
                            </select><br />
                            <label>Presentator Name: </label><br />
                            <input placeholder="Name:" type="text" value={presname} onChange={(e) => setPresname(e.target.value)} /><br />
                        </> : <>
                            <label>Presentator Name: </label><br />
                            <input placeholder="Name:" type="text" value={presname} onChange={(e) => setPresname(e.target.value)} /><br />
                        </>
                }
                <p id="errors">{error}</p>
                <div className="button-container">
                    <button onClick={handlechangepresentator}>{action === "update" ? "Save" : "Create New"} Presentator</button>
                </div>
            </div>
        </div>
    )
}