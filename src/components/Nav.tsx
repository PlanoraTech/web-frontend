import { useEffect, useState } from 'react';
import { useTheme } from "../ThemeContext";
import { getBearerToken } from '../functions/utils';
import { Link } from 'react-router';

export function Nav() {
    const [loggedin, setLoggedin] = useState('Sign up/Login');
    const [loggedinlink, setLoggedinLink] = useState('login');
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        if (getBearerToken()) {
            async function autologin() {
                const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/login/auto`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${getBearerToken()}`
                    }
                })
                if (!response.ok) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('role');
                } else {
                    const data = await response.json();
                    localStorage.setItem('institutions', JSON.stringify(data.user.institutions));
                    for (let i = 0; i < data.user.institutions.length; i++) {
                        if (data.user.institutions[i].role === 'DIRECTOR') {
                            localStorage.setItem('role', "DIRECTOR");
                        }
                    }
                    if (data.user.institutions.length === 0) {
                        localStorage.setItem('role', "USER");
                    }
                    setLoggedin('Profile');
                    setLoggedinLink('profile');
                }
            }
            autologin();
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('institutions');
            localStorage.removeItem('presentatorid');
            setLoggedin('Sign up/Login');
            setLoggedinLink('login');
        }
    }, [])

    return (
        <>
            <ul>
                <li><Link to="/home"><b>Home</b></Link></li>
                <li><Link to="/timetables"><b>Institutions</b></Link></li>
                {localStorage.getItem('role') === 'DIRECTOR' ? <li><Link to="/manage"><b>Manage</b></Link></li> : null}
                <li id="login-nav"><Link to={`/${loggedinlink}`}><b>{loggedin}</b></Link></li>
                <li id="light-dark-switch" onClick={toggleTheme}><b>{theme === "light" ? "Dark Mode" : "Light Mode"}</b></li>
            </ul >
        </>
    );
}