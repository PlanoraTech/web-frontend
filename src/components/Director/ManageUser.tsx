import { useState } from "react";
import { Institutions } from "../../shared/classes/institutions";
import { Users } from "../../shared/classes/users";
import { getBearerToken } from "../../functions/utils";

interface Props {
    institution: Institutions;
    action: "add" | "update";
}

export function ManageUser(props: Props) {
    const [email, setEmail] = useState<string>("");
    const [user, setUser] = useState<Users | null>(null);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    const handlechangeuser = async () => {
        setError("");
        setSuccess("");
        let change = 'POST';
        let url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/users`
        if (props.action === "update") {
            change = 'PATCH';
            url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/users/${user?.getId()}`
        }
        if (email.trim() === "") {
            setError("Email and role must be filled out");
            return;
        }
        const response = await fetch(url, {
            method: change,
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${getBearerToken()}`
            },
            body: JSON.stringify({ email: email }),
        });
        if (!response.ok) {
            const data = await response.json();
            setError(data.message);
        }
        else {
            props.action === "update" ? setSuccess("User updated successfully") : setSuccess("User created successfully");
            setEmail("");
        }

    }

    const handleuserchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = props.institution.getUsers()?.find((user: Users) => user.getEmail() === e.target.value);
        if (selected) {
            setEmail(selected.getEmail());
            setUser(selected);
            setError("");
            setSuccess("");
        }
    }

    const handledeleteUser = async () => {
        if (confirm("Are you sure you want to delete this user?")) {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/users/${user?.getId()}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getBearerToken()}`
                }
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            }
            else {
                setSuccess("User deleted successfully");
                setEmail("");
            }
        } else {
            setError("User deletion cancelled");
        }
    }

    const inputs = () => {
        return (
            <>
                <label>User Email: </label><br />
                <input placeholder="Email:" type="text" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
            </>
        )
    }

    return (
        <div className="form-container">
            <h2>{props.action === "update" ? "Update" : "Add"} User</h2>
            <div className="form-div">
                {
                    props.action === "update" ? <>
                        <select onChange={handleuserchange} value={user?.getEmail() || 'default'}>
                            <option value="default" disabled>Users</option>
                            {props.institution.getUsers()?.map((user: Users) => (
                                <option key={user.getEmail()} value={user.getEmail()}>{user.getEmail()}</option>
                            ))}
                        </select><br />
                        {user ? <>
                            {inputs()}
                        </> : null}
                    </> : <>
                        {inputs()}
                    </>
                }
                {error && <p id="errors">{error}</p>}
                {success && <p id="success">{success}</p>}
                <div className="button-container">
                    <button onClick={handlechangeuser}>{props.action === "update" ? "Update" : "Add"} User</button>
                    {props.action === "update" ? <button onClick={handledeleteUser}>Delete User</button> : null}
                </div>
            </div>
        </div>
    );
}
