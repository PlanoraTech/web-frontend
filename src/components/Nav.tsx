import square_logo from '../assets/square_logo.png';

export function Nav() {
    return (
        <ul>
            <li className="logo_nav_img"><a href="/home"><img src={square_logo} alt="logo" /></a></li>
            <li className="logo_nav"><a href="/home">Logo</a></li>
            <li><a href="/timetables">Institutions</a></li>
            <li className="login_nav"><a href="/login">Sign up/Login</a></li>
            <li className="light_dark_switch"><a href="">Light/dark</a></li>
        </ul>
    );
}