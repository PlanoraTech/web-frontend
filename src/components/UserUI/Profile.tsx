import { useEffect, useState } from "react";
import { Nav } from "../Nav"
import { getTokenUrl } from "../../functions/getTokenUrl";

export function Profile() {
    const [email, setEmail] = useState("");
    const [institutions, setInstitutions] = useState([]);

    let token = localStorage.getItem('token');
    const headers = { 'Authorization': `Bearer ${token}` };

    const handlelogout = async () => {
        const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/logout`, { headers });
        if (!response.ok) {
            const data = await response.json();
            console.log(data);
        } else {
            const data = await response.json();
            console.log(data);
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