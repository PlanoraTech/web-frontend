import { useEffect, useState } from 'react';
import { useTheme } from "../ThemeContext";

export function Nav() {
    const [loggedin, setLoggedin] = useState('Sign up/Login');
    const [loggedinlink, setLoggedinLink] = useState('login');
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        if (localStorage.getItem('token')) {
            let token = localStorage.getItem('token')
            const expiry: Date = new Date(localStorage.getItem('expiry')!);
            if (expiry < new Date(Date.now())) {
                localStorage.removeItem('token');
                localStorage.removeItem('expiry');
                localStorage.removeItem('role');
            } else {
                async function autologin() {
                    const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/login/auto`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    })
                    if (!response.ok) {
                        localStorage.removeItem('token');
                        localStorage.removeItem('expiry');
                        localStorage.removeItem('role');
                    } else {
                        const data = await response.json();
                        // console.log(data);
                        localStorage.setItem('expiry', data.expiry);
                        // console.log(data.user.institutions)
                        localStorage.setItem('institutions', JSON.stringify(data.user.institutions));
                        for (let i = 0; i < data.user.institutions.length; i++) {
                            if (data.user.institutions[i].role === 'DIRECTOR') {
                                localStorage.setItem('role', "DIRECTOR");
                            }
                        }
                        if (data.user.institutions.length === 0) {
                            localStorage.setItem('role', "USER");
                        }
                        // console.log(localStorage.getItem('institutions'));
                        setLoggedin('Profile');
                        setLoggedinLink('profile');
                    }
                }
                autologin();
            }
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('expiry');
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
                <li className="logo-nav"><a className='links' href="/home"><b>Home</b></a></li>
                <li><a className='links' href="/timetables"><b>Institutions</b></a></li>
                {localStorage.getItem('role') === 'DIRECTOR' ? <li><a className='links' href="/manage"><b>Manage</b></a></li> : null}
                <li className="login-nav"><a className='links' href={`/${loggedinlink}`}><b>{loggedin}</b></a></li>
                <li className="light-dark-switch" onClick={toggleTheme}><b>{theme === "light" ? "Dark Mode" : "Light Mode"}</b></li>
            </ul >
        </>
    );
}