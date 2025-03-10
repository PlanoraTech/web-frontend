import { useEffect, useState } from "react";
import { Institutions } from "../../shared/classes/institutions";
import { Users } from "../../shared/classes/users";

interface Props {
    institution: Institutions;
    action: "add" | "update";
}

export function ManageUser(props: Props) {
    const [email, setEmail] = useState<string>("");
    const [role, setRole] = useState<string>("");
    const [user, setUser] = useState<Users | null>(null);
    const [action, setAction] = useState<"add" | "update">("add");
    const [error, setError] = useState<string>("");

    let baseUrl = 'https://planora-dfce142fac4b.herokuapp.com/institutions';
    let localUrl = 'http://localhost:3000/institutions';
    let tokenUrl = `?token=${localStorage.getItem('token')}`;

    useEffect(() => {
        if (props.action === "update") {
            setAction("update");
        }
    }, [user])

    const handlechangeuser = async () => {
        let change = 'POST';
        let url = `${baseUrl}/${props.institution.getId()}/users/${tokenUrl}`
        if (action === "update") {
            change = 'PATCH';
            url = `${baseUrl}/${props.institution.getId()}/users/${user?.getId()}/${tokenUrl}`
        }
        if (email === "" || role === "") {
            setError("Email and role must be filled out");
        } else {
            const response = await fetch(url, {
                method: change,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email: email, role: role }),
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            }
            else {
                console.log(response);
                setError("");
                setEmail("");
                setRole("");
            }
        }
    }

    const handleuserchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const user = props.institution.getUsers()?.find((user: Users) => user.getEmail() === e.target.value);
        setEmail(user!.getEmail());
        setRole(user!.getRole());
        setUser(user!);
    }

    return (
        <div className="form-container">
            <h2>{action === "update" ? "Update" : "Add"} User</h2>
            <div className="form-div">
                {
                    action === "update" ? <>
                        <select onChange={handleuserchange} value={user?.getEmail() || 'default'}>
                            <option value="default" disabled>Users</option>
                            {props.institution.getUsers()?.map((user: Users) => (
                                <option key={user.getEmail()} value={user.getEmail()}>{user.getEmail()}</option>
                            ))}
                        </select><br />
                        <label>User Email: </label><br />
                        <input placeholder="Email:" type="text" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
                        <label>User Role: </label><br />
                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="default" disabled>Role</option>
                            <option value="USER">User</option>
                            <option value="PRESENTATOR">Presentator</option>
                            <option value="DIRECTOR">Director</option>
                        </select><br />
                    </> : <>
                        <label>User Email: </label><br />
                        <input placeholder="Email:" type="text" value={email} onChange={(e) => setEmail(e.target.value)} /><br />
                        <label>User Role: </label><br />
                        <select value={role || "default"} onChange={(e) => setRole(e.target.value)}>
                            <option value="default" disabled>Role</option>
                            <option value="USER">User</option>
                            <option value="PRESENTATOR">Presentator</option>
                            <option value="DIRECTOR">Director</option>
                        </select><br />
                    </>
                }
                <p id="errors">{error}</p>
                <div className="button-container">
                    <button onClick={handlechangeuser}>{action === "update" ? "Update" : "Add"} User</button>
                </div>
            </div>
        </div>
    );
}
