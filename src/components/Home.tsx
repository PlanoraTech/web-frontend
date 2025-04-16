import { Nav } from "./Nav";


export function Home() {
    return (
        <>
            <Nav />
            <div className="home-container">
                <div className="home-big">
                    <div className="home-content">
                        <h1>Welcome to <span id="planora">Planora</span></h1>
                        <p>
                            The **All-in-One** School & Institution Management System for planning your future.
                        </p>
                    </div>
                </div>

                <div className="home-small">
                    <div className="content-box">
                        <h2>Smarter Scheduling</h2>
                        <p>Automate and optimize schedules without the hassle.</p>
                    </div>
                    <div className="content-box">
                        <h2>Complete Institution Management</h2>
                        <p>Handle timetables, event calendars, room bookings, and more in one place.</p>
                    </div>
                    <div className="content-box">
                        <h2>Future-Proof Your Planning</h2>
                        <p>Say goodbye to outdated tools and hello to streamlined productivity!</p>
                    </div>
                </div>
            </div>
        </>
    );
}