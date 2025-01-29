import { useState } from "react";
import { Nav } from "../Nav";

export function Login() {
    const [register, setRegister] = useState(false);
    const [login, setLogin] = useState(true);

    const handleregister = () => {
        setRegister(true);
    }

    const handlelogin = () => {
        setRegister(false);
    }



    return (
        <>
            <Nav />
            {
                register ? (
                    <div className="login-register-container">
                        <h2>Register</h2>
                        <div className="login-register-form">
                            <label htmlFor="email">Email</label><br />
                            <input type="text" id="email" name="email" /><br />
                            <label htmlFor="email-again">Email again</label><br />
                            <input type="text" id="email-again" name="email-again" /><br />
                            <label htmlFor="password">Password</label><br />
                            <input type="password" id="password" name="password" /><br />
                            <label htmlFor="password-again">Password again</label><br />
                            <input type="password" id="password-again" name="password-again" /><br />
                            <div className="button-container">
                                <button className="submit-button" type="submit">Register</button><br />
                            </div>
                            <p>Already have an account? Click <span className="login-register-button" onClick={handlelogin}>here</span> to login</p>
                        </div>
                    </div>
                ) : (
                    <div className="login-register-container">
                        <h2>Login</h2>
                        <div className="login-register-form">
                            <label htmlFor="email">Email</label><br />
                            <input type="text" id="email" name="email" /><br />
                            <label htmlFor="password">Password</label><br />
                            <input type="password" id="password" name="password" /><br />
                            <div className="button-container">
                                <button className="submit-button" type="submit">Login</button><br />
                            </div>
                            <p>Don't have an account? Click <span className="login-register-button" onClick={handleregister}>here</span> to register</p>
                        </div>
                    </div>
                )
            }

        </>
    )
}