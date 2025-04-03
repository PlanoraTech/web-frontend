import { useEffect, useState } from "react";
import { Institutions } from "../../shared/classes/institutions";
import { Presentators } from "../../shared/classes/presentators";
import { Users } from "../../shared/classes/users";

interface Props {
    institution: Institutions;
}

export function ManagePresentator(props: Props) {
    const [presname, setPresname] = useState<string>("");
    const [presentator, setpresentator] = useState<Presentators | null>(null);
    const [user, setUser] = useState<Users | null>(null);
    const [error, setError] = useState<string>("");
    let token = localStorage.getItem('token');

    useEffect(() => {
        console.log('asd');
    }, [user])

    const handlechangepresentator = async () => {
        let url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/presentators`
        if (presname === "") {
            setError("Please fill in all fields");
        } else {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
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

    const handleUserchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        console.log(e.target.value)
        const chosenuser = props.institution.getUsers()?.find((user: Users) => user.getEmail() === e.target.value);
        console.log(chosenuser!)
        setUser(chosenuser!)
    }

    return (
        <div className="form-container">
            <h2>Add Presentator</h2>
            <div className="form-div">
                <label>Presentator Name: </label><br />
                <input placeholder="Name:" type="text" value={presname} onChange={(e) => setPresname(e.target.value)} /><br />
                <label>Add user to presentator: </label><br />
                <select value={user?.getId() || "default"} onChange={handleUserchange}>
                    <option value="default">Select User</option>
                    {props.institution.getUsers()?.map((user: Users) => (
                        <option key={user.getId()} value={user.getId()}>{user.getEmail()}</option>
                    ))}
                </select><br />
                <p id="errors">{error}</p>
                <div className="button-container">
                    <button onClick={handlechangepresentator}>Create New Presentator</button>
                </div>
            </div>
        </div>
    )
}