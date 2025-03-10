import { useEffect, useState } from "react";
import { Nav } from "../Nav"

export function Profile() {
    const [email, setEmail] = useState("");

    let baseUrl = 'https://planora-dfce142fac4b.herokuapp.com';
    let localUrl = 'http://localhost:3000';
    let tokenUrl = `?token=${localStorage.getItem('token')}`;

    const handlelogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('expiry');
        localStorage.removeItem('role');
        window.location.href = "/login";
    }

    const mockPresentator = {
        institutionId: "14033494-a508-46f2-87d3-102da56519f0",
        presentatorId: "a101e101-1954-47df-8d0b-c2836af4fc8b",
        role: "PRESENTATOR"
    }

    useEffect(() => {
        async function fetchProfile() {
            const response = await fetch(`${baseUrl}/profile/${tokenUrl}`);
            if (!response.ok) {
            } else {
                const data = await response.json();
                console.log(data);
                if (data.email == 'test@presentator.hu') {
                    localStorage.setItem('role', mockPresentator.role)
                    localStorage.setItem('presentatorid', mockPresentator.presentatorId)
                    localStorage.setItem('institution', '')
                }
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
                    <p>Role: {localStorage.getItem("role")}</p>
                </div>
                <div className="button-container">
                    <button onClick={handlelogout}>Logout</button>
                </div>
            </div>
        </>
    )
}