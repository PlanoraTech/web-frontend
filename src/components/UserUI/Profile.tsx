import { useEffect, useState } from "react";
import { Nav } from "../Nav"

export function Profile() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newpassword, setNewPassword] = useState("");
    const [newpasswordagain, setNewPasswordAgain] = useState("");
    const [institutions, setInstitutions] = useState([]);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!localStorage.getItem('token')) {
            window.location.href = "/login";
        }
    }, []);

    let token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    const handlelogout = async () => {
        const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/logout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ token: localStorage.getItem('token') }),
        })
        if (!response.ok) {
            console.log(response.status);
        } else {
            console.log(response.status);
            localStorage.removeItem('token');
            localStorage.removeItem('expiry');
            localStorage.removeItem('role');
            window.location.href = "/login";
        }
    }

    useEffect(() => {
        async function fetchProfile() {
            const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/profile`, { headers });
            if (!response.ok) {
                const data = await response.json();
                console.log(data);
            } else {
                const data = await response.json();
                console.log(data);
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
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ oldPassword: password, newPassword: password }),
            })
            if (!response.ok) {
                const data = await response.json();
                console.log(data);
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
            <div className="profile-container">
                <div className="form-div profile-div">
                    <h2>Profile</h2>
                    <p><b>Email:</b> {email}</p>
                    <p><b>Institutions: </b></p>
                    {institutions.map((institution: any) => (
                        <p style={{ marginLeft: '2vh' }} key={email}>{institution.institution.name} - {institution.role}</p>
                    ))}
                    <label><b>Change password: </b></label>
                    <div className="input-container">
                        <input type="password" placeholder="Old password" onChange={(e) => setPassword(e.target.value)} value={password} />
                        <input type="password" placeholder="New password" onChange={(e) => setNewPassword(e.target.value)} value={newpassword} />
                        <input type="password" placeholder="New password again" onChange={(e) => setNewPasswordAgain(e.target.value)} value={newpasswordagain} />
                    </div>
                </div>
                <p id="errors">{error}</p>
                <div className="button-container">
                    <button onClick={changepassword}>Save password</button>
                    <button onClick={handlelogout}>Logout</button>
                </div>
            </div>
        </>
    )
}