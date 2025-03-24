import { Nav } from "./Nav";


export function Home() {
    return (
        <>
            <Nav />
            <div className="home-container">
                <section className="hero">
                    <div className="hero-content">
                        <h1>Welcome to <span className="brand">Planora</span></h1>
                        <p>
                            The **All-in-One** School & Institution Management System for planning your future.
                        </p>
                    </div>
                </section>

                <section className="features">
                    <div className="feature">
                        <h2>Smarter Scheduling</h2>
                        <p>Automate and optimize schedules without the hassle.</p>
                    </div>
                    <div className="feature">
                        <h2>Complete Institution Management</h2>
                        <p>Handle timetables, event calendars, room bookings, and more in one place.</p>
                    </div>
                    <div className="feature">
                        <h2>Future-Proof Your Planning</h2>
                        <p>Say goodbye to outdated tools and hello to streamlined productivity!</p>
                    </div>
                </section>
            </div>
        </>
    );
}