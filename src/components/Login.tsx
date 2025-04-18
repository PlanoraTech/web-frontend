import { useState } from "react";
import { Nav } from "./Nav";
import { useNavigate } from "react-router";
import { CostumCheckbox } from "./CostumCheckbox";

export function Login() {
    const [error, setError] = useState("");
    const [register, setRegister] = useState(false);
    const [regemail, setRegEmail] = useState("");
    const [regemailagain, setRegEmailAgain] = useState("");
    const [regpasswordagain, setRegPasswordAgain] = useState("");
    const [regpassword, setRegPassword] = useState("");
    const [logemail, setLogEmail] = useState("");
    const [logpassword, setLogPassword] = useState("");
    const [rememberMe, setRememberMe] = useState(false);

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
        setError("");
        if (!logemail || !logpassword) {
            setError("Please fill in all fields");
            return;
        }
        const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: logemail, password: logpassword, rememberMe: rememberMe }),
        });
        if (!response.ok) {
            const data = await response.json();
            setError(data.message);
        } else {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            localStorage.setItem('institutions', JSON.stringify(data.user.institutions));
            if (data.user.institutions.length === 0) {
                localStorage.setItem('role', "USER");
            }
            navigate('/profile');
            setError("");
            setLogEmail("");
            setLogPassword("");
            setRememberMe(false);
        }
    }

    const handleregister = async () => {
        setError("");
        if (!regemail || !regemailagain || !regpassword || !regpasswordagain) {
            setError("Please fill in all fields");
            return;
        }
        if (regemail != regemailagain) {
            setError("Emails are not the same");
            return;
        }
        if (regpassword != regpasswordagain) {
            setError("Passwords are not the same");
            return;
        }
        if (/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim.test(regemail) == false) {
            setError("Invalid email");
            return;
        }
        if (/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&#]{8,128}$/.test(regpassword) == false) {
            setError("Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character");
            return;
        }
        const response = await fetch(`${import.meta.env.VITE_AUTH_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: regemail, password: regpassword }),
        });
        if (!response.ok) {
            const data = await response.json();
            setError(data.message);
        } else {
            const data = await response.json();
            localStorage.setItem('token', data.token);
            navigate('/profile');
            setError("");
            setRegEmail("");
            setRegEmailAgain("");
            setRegPassword("");
            setRegPasswordAgain("");
        }

    }


    return (
        <>
            <Nav />
            {
                register ? (
                    <div className="form-container">
                        <h2>Register</h2>
                        <div className="form-div">
                            <label htmlFor="reg-email">Email</label><br />
                            <input type="text" id="reg-email" name="reg-email" placeholder="Email" value={regemail} onChange={(e) => setRegEmail(e.target.value)} required /><br />
                            <label htmlFor="reg-email-again">Email again</label><br />
                            <input type="text" id="reg-email-again" name="reg-email-again" placeholder="Email again" value={regemailagain} onChange={(e) => setRegEmailAgain(e.target.value)} required /><br />
                            <label htmlFor="reg-password">Password</label><br />
                            <input type="password" id="reg-password" name="reg-password" placeholder="Password" value={regpassword} onChange={(e) => setRegPassword(e.target.value)} required /><br />
                            <label htmlFor="reg-password-again">Password again</label><br />
                            <input type="password" id="reg-password-again" name="reg-password-again" placeholder="Password again" value={regpasswordagain} onChange={(e) => setRegPasswordAgain(e.target.value)} required /><br />
                            {error && <p id="errors">{error}</p>}
                            <div className="button-container">
                                <button className="submit-button" type="button" onClick={handleregister}>Register</button><br />
                            </div>
                            <p>Already have an account? Click <span className="form-button" onClick={changelogin}>here</span> to login!</p>
                        </div>
                    </div>
                ) : (
                    <div className="form-container">
                        <h2>Login</h2>
                        <div className="form-div">
                            <label htmlFor="log-email">Email</label><br />
                            <input type="text" id="log-email" name="log-email" placeholder="Email" value={logemail} onChange={(e) => setLogEmail(e.target.value)} required /><br />
                            <label htmlFor="log-password">Password</label><br />
                            <input type="password" id="log-password" name="log-password" placeholder="Password" value={logpassword} onChange={(e) => setLogPassword(e.target.value)} required /><br />
                            {error && <p id="errors">{error}</p>}
                            <CostumCheckbox where="bottom" labelText="Remember Me?" onChange={() => setRememberMe(!rememberMe)} checked={rememberMe} />
                            <div className="button-container">
                                <button className="submit-button" type="button" onClick={handlelogin}>Login</button><br />
                            </div>
                            <p>Don't have an account? Click <span className="form-button" onClick={changeregister}>here</span> to register!</p>
                        </div>
                    </div>
                )
            }
        </>
    )
}