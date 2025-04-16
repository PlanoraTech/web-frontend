import { useEffect, useState } from "react";
import { Nav } from "./Nav"
import { getBearerToken } from "../functions/utils";
import { CostumCheckbox } from "./CostumCheckbox";

export function Profile() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newpassword, setNewPassword] = useState("");
    const [newpasswordagain, setNewPasswordAgain] = useState("");
    const [all, setAll] = useState(false);
    const [institutions, setInstitutions] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!getBearerToken()) {
            window.location.href = "/login";
        }
    }, []);


    const handlelogout = async () => {
        let url = `${import.meta.env.VITE_AUTH_URL}/logout`;
        if (all) {
            url = `${import.meta.env.VITE_AUTH_URL}/logout/all`;
        }
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getBearerToken()}`
            },
            body: JSON.stringify({ token: getBearerToken() }),
        })
        if (!response.ok) {
            setError(await response.text());
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('institutions');
            localStorage.removeItem('presentatorid');
            window.location.href = "/login";
        }
    }

    const headers = { 'Authorization': `Bearer ${getBearerToken()}` };

    useEffect(() => {
        async function fetchProfile() {
            const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/profile`, { headers });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            } else {
                const data = await response.json();
                setEmail(data.email);
                setInstitutions(data.institutions);
            }
        }
        fetchProfile();
    }, [])

    const changepassword = async () => {
        if (password === "" || newpassword === "" || newpasswordagain === "") {
            setError("Please fill in all fields");
        }
        if (newpassword !== newpasswordagain) {
            setError("New passwords do not match");
        }
        if (error == "") {
            const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/profile`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getBearerToken()}`
                },
                body: JSON.stringify({ oldPassword: password, newPassword: newpassword }),
            })
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            } else {
                setError("Password changed successfully");
                setPassword("");
                setNewPassword("");
                setNewPasswordAgain("");
            }
        }
    }

    return (
        <>
            <Nav />
            <div id="profile-container">
                <div className="form-div profile-div">
                    <h2>Profile</h2>
                    <p><b>Email:</b> {email}</p>
                    <p><b>Institutions: </b></p>
                    {institutions.map((institution: any) => (
                        <p style={{ marginLeft: '2vh' }} key={email}>{institution.institution.name} - {institution.role}</p>
                    ))}
                    <label><b>Change password: </b></label>
                    <div id="input-container">
                        <input type="password" placeholder="Old password" onChange={(e) => setPassword(e.target.value)} value={password} />
                        <input type="password" placeholder="New password" onChange={(e) => setNewPassword(e.target.value)} value={newpassword} />
                        <input type="password" placeholder="New password again" onChange={(e) => setNewPasswordAgain(e.target.value)} value={newpasswordagain} />
                    </div>
                </div>
                <p id="errors">{error}</p>
                <CostumCheckbox where="bottom" labelText="Logout from all devices?" checked={all} onChange={() => setAll(!all)} />
                <div className="button-container">
                    <button onClick={changepassword}>Save password</button>
                    <button onClick={handlelogout}>Logout</button>
                </div>
            </div>
        </>
    )
}