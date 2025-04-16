import { useState } from "react";
import { Institutions } from "../../shared/classes/institutions";
import { Users } from "../../shared/classes/users";
import { getBearerToken } from "../../functions/utils";

interface Props {
    institution: Institutions;
}

export function ManagePresentator(props: Props) {
    const [presname, setPresname] = useState<string>("");
    const [selecteduser, setSelectedUser] = useState<Users | null>(null);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    const handlechangepresentator = async () => {
        setError("");
        setSuccess("");
        if (presname.trim() === "" || !selecteduser) {
            setError("Please fill in all fields");
            return;
        }
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/presentators/${selecteduser?.getId()}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getBearerToken()}`
            },
            body: JSON.stringify({ name: presname }),
        });
        if (!response.ok) {
            const data = await response.json();
            setError(data.message);
        }
        else {
            setSuccess("Presentator created successfully");
            setPresname("");
        }

    }

    const handleUserchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const chosenuser = props.institution.getUsers()?.find((user: Users) => user.getEmail() === e.target.value);
        setSelectedUser(chosenuser!)
        setError("");
        setSuccess("");
    }

    return (
        <div className="form-container">
            <h2>Add Presentator</h2>
            <div className="form-div">
                <label>Presentator Name: </label><br />
                <input placeholder="Name:" type="text" value={presname} onChange={(e) => setPresname(e.target.value)} /><br />
                <label>Add user to presentator: </label><br />
                <select onChange={handleUserchange} value={selecteduser?.getEmail() || "default"}>
                    <option value="default" disabled>Select User</option>
                    {props.institution.getUsers()?.map((user: Users) => (
                        <option key={user.getId()} value={user.getEmail()}>{user.getEmail()}</option>
                    ))}
                </select><br />
                {error && <p id="errors">{error}</p>}
                {success && <p id="success">{success}</p>}
                <div className="button-container">
                    <button onClick={handlechangepresentator}>Create New Presentator</button>
                </div>
            </div>
        </div>
    )
}