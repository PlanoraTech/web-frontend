import square_logo from '../assets/square_logo.png';
import { useEffect, useState } from 'react';

export function Nav() {
    const [darkmode, setDarkmode] = useState(true);
    const [hovercolor, setHovercolor] = useState('');
    const [loggedin, setLoggedin] = useState('Sign up/Login');
    const [loggedinlink, setLoggedinLink] = useState('login');

    const rootStyles = getComputedStyle(document.documentElement);
    const dark01 = rootStyles.getPropertyValue("--dark01");
    const dark03 = rootStyles.getPropertyValue("--dark03");
    const light02 = rootStyles.getPropertyValue("--light02");
    const dark02 = rootStyles.getPropertyValue("--dark02");
    const dark_text = rootStyles.getPropertyValue("--dark-text");
    const light_text = rootStyles.getPropertyValue("---light-text");
    const light07 = rootStyles.getPropertyValue("--light07");
    const light10 = rootStyles.getPropertyValue("--light10");

    const handlechange = () => {
        if (darkmode) {
            localStorage.removeItem('theme');
            setDarkmode(false);
            localStorage.setItem('theme', 'light');
        } else {
            localStorage.removeItem('theme');
            setDarkmode(true);
            localStorage.setItem('theme', 'dark');
        }
    }

    useEffect(() => {
        // if (localStorage.getItem('theme') === 'light') {
        //     document.body.style.backgroundColor = `${lightmodeStyles.bodyBackgound}`;
        // } else {
        //     document.body.style.backgroundColor = `${darkmodeStyles.bodyBackgound}`;
        // }
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

    const darkmodeStyles = {
        bodyBackgound: dark03,
        color: dark_text,
        navBackground: dark02,
        linksColor: dark_text,
        linksHover: dark01,
    }

    const lightmodeStyles = {
        bodyBackgound: light02,
        color: light_text,
        navBackground: light07,
        linksColor: light_text,
        linksHover: light10,
    }

    const changehovertrue = () => {
        console.log(hovercolor);
        if (darkmode) {
            setHovercolor(dark01)
        } else {
            setHovercolor(light10)
        }
        console.log(hovercolor);
    }

    const changehoverfalse = () => {
        if (darkmode) {
            setHovercolor(dark02)
        } else {
            setHovercolor(light07)
        }
        console.log(hovercolor);
    }

    return (
        <>
            {
                darkmode ? (
                    <ul style={{ backgroundColor: `${darkmodeStyles.navBackground}` }}>
                        <li className="logo-nav-img"><a style={{ color: `${darkmodeStyles.color}`, backgroundColor: `${hovercolor}` }} onMouseEnter={changehovertrue} onMouseLeave={changehoverfalse} className='links' href="/home"><img src={square_logo} alt="logo" /></a></li>
                        <li className="logo-nav"><a style={{ color: `${darkmodeStyles.color}`, backgroundColor: `${hovercolor}` }} onMouseEnter={changehovertrue} onMouseLeave={changehoverfalse} className='links' href="/home">Home</a></li>
                        <li><a style={{ color: `${darkmodeStyles.color}`, backgroundColor: `${hovercolor}` }} onMouseEnter={changehovertrue} onMouseLeave={changehoverfalse} className='links' href="/timetables">Institutions</a></li>
                        <li className="login-nav"><a style={{ color: `${darkmodeStyles.color}`, backgroundColor: `${hovercolor}` }} onMouseEnter={changehovertrue} onMouseLeave={changehoverfalse} className='links' href={`/${loggedinlink}`}>{loggedin}</a></li>
                        <li style={{ color: `${darkmodeStyles.color}`, backgroundColor: `${hovercolor}` }} onMouseEnter={changehovertrue} onMouseLeave={changehoverfalse} className="light-dark-switch" onClick={handlechange}>Lightmode</li>
                    </ul >
                ) : (
                    <ul style={{ backgroundColor: `${lightmodeStyles.navBackground}` }}>
                        <li className="logo-nav-img"><a style={{ color: `${lightmodeStyles.color}`, backgroundColor: `${hovercolor}` }} onMouseEnter={changehovertrue} onMouseLeave={changehoverfalse} className='links' href="/home"><img src={square_logo} alt="logo" /></a></li>
                        <li className="logo-nav"><a style={{ color: `${lightmodeStyles.color}`, backgroundColor: `${hovercolor}` }} onMouseEnter={changehovertrue} onMouseLeave={changehoverfalse} className='links' href="/home">Home</a></li>
                        <li><a style={{ color: `${lightmodeStyles.color}`, backgroundColor: `${hovercolor}` }} onMouseEnter={changehovertrue} onMouseLeave={changehoverfalse} className='links' href="/timetables">Institutions</a></li>
                        <li className="login-nav"><a style={{ color: `${lightmodeStyles.color}`, backgroundColor: `${hovercolor}` }} onMouseEnter={changehovertrue} onMouseLeave={changehoverfalse} className='links' href={`/${loggedinlink}`}>{loggedin}</a></li>
                        <li style={{ color: `${lightmodeStyles.color}`, backgroundColor: `${hovercolor}` }} onMouseEnter={changehovertrue} onMouseLeave={changehoverfalse} className="light-dark-switch" onClick={handlechange}>Darkmode</li>
                    </ul >
                )
            }
        </>
    );
}