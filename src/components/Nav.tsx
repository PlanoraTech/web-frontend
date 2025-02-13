import square_logo from '../assets/square_logo.png';
import { useEffect, useState } from 'react';
import { useTheme } from "../ThemeContext";

export function Nav() {
    const [darkmode, setDarkmode] = useState(true);
    const [loggedin, setLoggedin] = useState('Sign up/Login');
    const [loggedinlink, setLoggedinLink] = useState('login');
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            const expiry: Date = new Date(localStorage.getItem('expiry')!);
            if (expiry < new Date(Date.now())) {
                localStorage.removeItem('token');
                localStorage.removeItem('expiry');
                localStorage.removeItem('role');
            } else {
                async function autologin() {
                    const response = await fetch('http://localhost:3000/login', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ token: localStorage.getItem('token') }),
                    })
                    if (!response.ok) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('expiry');
                        localStorage.removeItem('role');
                    } else {
                        const data = await response.json();
                        localStorage.setItem('expiry', data.expiry);
                        localStorage.setItem('role', data.user.role);
                        localStorage.setItem('institutions', JSON.stringify(data.user.institutions));
                        setLoggedin('Profile');
                        setLoggedinLink('profile');
                    }
                }
                autologin();
            }
        }
    }, [])

    return (
        <>
            <ul>
                <li className="logo-nav-img"><a className='links' href="/home"><img src={square_logo} alt="logo" /></a></li>
                <li className="logo-nav"><a className='links' href="/home">Home</a></li>
                <li><a className='links' href="/timetables">Institutions</a></li>
                <li className="login-nav"><a className='links' href={`/${loggedinlink}`}>{loggedin}</a></li>
                <li className="light-dark-switch" onClick={toggleTheme}>{theme === "light" ? "Dark Mode" : "Light Mode"}</li>
            </ul >
        </>
    );
}