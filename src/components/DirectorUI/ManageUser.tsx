import { useState } from "react";
import { Institutions } from "../../shared/classes/institutions";
import { Users } from "../../shared/classes/users";

interface Props {
    institution: Institutions;
    action: "add" | "update";
}

export function ManageUser(props: Props) {
    const [email, setEmail] = useState<string>("");
    const [user, setUser] = useState<Users | null>(null);
    const [error, setError] = useState<string>("");
    let token = localStorage.getItem('token');

    const handlechangeuser = async () => {
        let change = 'POST';
        let url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/users`
        if (props.action === "update") {
            change = 'PATCH';
            url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/users/${user?.getId()}`
        }
        if (email === "") {
            setError("Email and role must be filled out");
        } else {
            const response = await fetch(url, {
                method: change,
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ email: email }),
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            }
            else {
                console.log(response);
                props.action === "update" ? setError("User updated successfully") : setError("User created successfully");
                setEmail("");
            }
        }
    }

    const handleuserchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const user = props.institution.getUsers()?.find((user: Users) => user.getEmail() === e.target.value);
        setEmail(user!.getEmail());
        setUser(user!);
    }

    const handledeleteUser = async () => {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/users/${user?.getId()}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            const data = await response.json();
            setError(data.message);
        }
        else {
            console.log(response);
            setError("User deleted successfully");
            setEmail("");
        }
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
                            <label>User Email: </label><br />
                            <input placeholder="Email:" type="text" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
                        </> : null}
                    </> : <>
                        <label>User Email: </label><br />
                        <input placeholder="Email:" type="text" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
                    </>
                }
                <p id="errors">{error}</p>
                <div className="button-container">
                    <button onClick={handlechangeuser}>{props.action === "update" ? "Update" : "Add"} User</button>
                    {props.action === "update" ? <button onClick={handledeleteUser}>Delete User</button> : null}
                </div>
            </div>
        </div>
    );
}
