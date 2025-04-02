import { useEffect, useState } from "react";
import { Nav } from "../Nav"

export function Profile() {
    const [email, setEmail] = useState("");
    const [institutions, setInstitutions] = useState([]);

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

    return (
        <>
            <Nav />
            <div className="profile-container">
                <div className="profile-div">
                    <h2>Profile</h2>
                    <p><b>Email:</b> {email}</p>
                    <p><b>Institutions: </b></p>
                    {institutions.map((institution: any) => (
                        <p style={{ marginLeft: '2vh' }} key={email}>{institution.institution.name} - {institution.role}</p>
                    ))}
                </div>
                <div className="button-container">
                    <button onClick={handlelogout}>Logout</button>
                </div>
            </div>
        </>
    )
}