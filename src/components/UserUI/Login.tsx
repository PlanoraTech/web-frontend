import { useState } from "react";
import { Nav } from "../Nav";
import { useNavigate } from "react-router";

export function Login() {
    const [error, setError] = useState("");
    const [register, setRegister] = useState(false);
    const [logemail, setLogEmail] = useState("");
    const [regemail, setRegEmail] = useState("");
    const [regemailagain, setRegEmailAgain] = useState("");
    const [logpassword, setLogPassword] = useState("");
    const [regpassword, setRegPassword] = useState("");
    const [regpasswordagain, setRegPasswordAgain] = useState("");

    const navigate = useNavigate();

    const changeregister = () => {
        setRegister(true);
        setError("");
    }

    const changelogin = () => {
        setRegister(false);
        setError("");
    }

    const handlelogin = async () => {
        if (!logemail || !logpassword) {
            setError("Please fill in all fields");
        } else {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: logemail, password: logpassword }),
            });
            if (!response.ok) {
                setError(await response.json());

            } else {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('expiry', data.expiry);
                localStorage.setItem('role', data.user.role);
                navigate('/profile');
                setError("");
                setLogEmail("");
                setLogPassword("");
            }
        }
    }

    const handleregister = async () => {
        if (!regemail || !regemailagain || !regpassword || !regpasswordagain) {
            console.log("empty fields");
            setError("Please fill in all fields");
        } else if (regemail != regemailagain) {
            console.log("emails are not the same");
            setError("Emails are not the same");
        } else if (regpassword != regpasswordagain) {
            console.log("passwords are not the same");
            setError("Passwords are not the same");
        } else if (/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim.test(regemail) == false) {
            console.log("invalid email");
            setError("Invalid email");
        } else if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&#]{8,128}$/.test(regpassword) == false) {
            console.log("invalid password");
            setError("Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character");
        } else {
            const response = await fetch('http://localhost:3000/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: regemail, password: regpassword }),
            });
            if (!response.ok) {
                setError(await response.json());
            } else {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('expiry', data.expiry);
                window.location.href = "/login";
                setError("");
                setRegEmail("");
                setRegEmailAgain("");
                setRegPassword("");
                setRegPasswordAgain("");
            }
        }
    }


    return (
        <>
            <Nav />
            {
                register ? (
                    <div className="login-register-container">
                        <h2>Register</h2>
                        <div className="login-register-div">
                            <label htmlFor="reg-email">Email</label><br />
                            <input type="text" id="reg-email" name="reg-email" placeholder="Email" value={regemail} onChange={(e) => setRegEmail(e.target.value)} required /><br />
                            <label htmlFor="reg-email-again">Email again</label><br />
                            <input type="text" id="reg-email-again" name="reg-email-again" placeholder="Email again" value={regemailagain} onChange={(e) => setRegEmailAgain(e.target.value)} required /><br />
                            <label htmlFor="reg-password">Password</label><br />
                            <input type="password" id="reg-password" name="reg-password" placeholder="Password" value={regpassword} onChange={(e) => setRegPassword(e.target.value)} required /><br />
                            <label htmlFor="reg-password-again">Password again</label><br />
                            <input type="password" id="reg-password-again" name="reg-password-again" placeholder="Password again" value={regpasswordagain} onChange={(e) => setRegPasswordAgain(e.target.value)} required /><br />
                            <p id="errors">{error}</p>
                            <div className="button-container">
                                <button className="submit-button" type="button" onClick={handleregister}>Register</button><br />
                            </div>
                            <p>Already have an account? Click <span className="login-register-button" onClick={changelogin}>here</span> to login!</p>
                        </div>
                    </div>
                ) : (
                    <div className="login-register-container">
                        <h2>Login</h2>
                        <div className="login-register-div">
                            <label htmlFor="log-email">Email</label><br />
                            <input type="text" id="log-email" name="log-email" placeholder="Email" value={logemail} onChange={(e) => setLogEmail(e.target.value)} required /><br />
                            <label htmlFor="log-password">Password</label><br />
                            <input type="password" id="log-password" name="log-password" placeholder="Password" value={logpassword} onChange={(e) => setLogPassword(e.target.value)} required /><br />
                            <p id="errors">{error}</p>
                            <div className="button-container">
                                <button className="submit-button" type="button" onClick={handlelogin}>Login</button><br />
                            </div>
                            <p>Don't have an account? Click <span className="login-register-button" onClick={changeregister}>here</span> to register!</p>
                        </div>
                    </div>
                )
            }
        </>
    )
}