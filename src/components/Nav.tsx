import square_logo from '../assets/square_logo.png';
import { useState } from 'react';

export function Nav() {
    const [darkmode, setDarkmode] = useState(true);

    const handlechange = () => {
        if (darkmode) {
            setDarkmode(true);
            document.body.className = "body-dark";
            // setDarkmode(false);
            // document.getElementsByClassName("light-dark-switch")[0].innerHTML = "Darkmode";
            // console.log("lightmode");

        } else {
            setDarkmode(true);
            document.body.className = "body-dark";
            // document.getElementsByClassName("light-dark-switch")[0].innerHTML = "Lightmode";
            // console.log("darkmode");
            // document.getElementsByClassName("nav")[0].className = "nav-dark";
            // var nav = document.getElementsByClassName("nav")[0];
            // for (let i = 0; i < nav.classList.length; i++) {
            //     document.getElementsByClassName("nav")[i].className = "nav-dark";
            // }
            // document.getElementsByClassName('class-card')[0]!.className = "class-card-dark";
            // document.getElementsByClassName("schedule")[0].className = "schedule-dark";
            // document.getElementsByTagName("select")[0].className = "select-button-dark";
            // document.getElementsByTagName("button")[0].className = "select-button-dark";
            // document.getElementsByClassName("day-header")[0].className = "day-header-dark";
            // document.getElementsByClassName("day-2")[0].className = "day-2-4-dark";
            // document.getElementsByClassName("day-4")[0].className = "day-2-4-dark";
        }
    }

    return (
        <>
            {
                darkmode ? (
                    <ul id='nav-bar' className='nav-dark'>
                        <li className="logo-nav-img"><a className='links nav-link-dark' href="/home"><img src={square_logo} alt="logo" /></a></li>
                        <li className="logo-nav"><a className='links nav-link-dark' href="/home">Logo</a></li>
                        <li><a className='links nav-link-dark' href="/timetables">Institutions</a></li>
                        <li className="login-nav"><a className='links nav-link-dark' href="/login">Sign up/Login</a></li>
                        <li className="light-dark-switch" onClick={handlechange}>Lightmode</li>
                    </ul >
                ) : (
                    <ul id='nav-bar' className='nav'>
                        <li className="logo-nav-img"><a className='links' href="/home"><img src={square_logo} alt="logo" /></a></li>
                        <li className="logo-nav"><a className='links' href="/home">Logo</a></li>
                        <li><a className='links' href="/timetables">Institutions</a></li>
                        <li className="login-nav"><a className='links' href="/login">Sign up/Login</a></li>
                        <li className="light-dark-switch" onClick={handlechange}>Lightmode</li>
                    </ul >
                )
            }
        </>
    );
}