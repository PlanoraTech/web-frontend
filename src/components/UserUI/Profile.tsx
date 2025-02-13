import { useEffect, useState } from "react";
import { Nav } from "../Nav"

export function Profile() {
    const [email, setEmail] = useState("");

    const handlelogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('expiry');
        localStorage.removeItem('role');
        window.location.href = "/login";
    }

    useEffect(() => {
        async function fetchProfile() {
            const response = await fetch('http://localhost:3000/profile?token=' + localStorage.getItem('token'));
            if (!response.ok) {
            } else {
                const data = await response.json();
                console.log(data);
                setEmail(data.email);
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
                    <p>Email: {email}</p>
                </div>
                <div className="button-container">
                    <button onClick={handlelogout}>Logout</button>
                </div>
            </div>
        </>
    )
}