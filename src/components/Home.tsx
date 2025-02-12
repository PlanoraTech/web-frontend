import { Nav } from "./Nav";


export function Home() {
    return (
        <>
            <Nav />
            <div className="introduction">
                <h1>Welcome to Planora!</h1>
                <p>Planora is a All-in-One School & Institution Management System for planning your future.</p>
                <p>
                    Managing schedules and timetables has never been easier!
                    Our goal is to build a comprehensive management system designed for schools and businesses,
                    streamlining scheduling, timetable creation, and resource allocation.
                </p>
                <p>
                    Unlike traditional systems that require multiple separate tools, our platform integrates essential
                    features into one seamless solution. Schools can not only create timetables but also manage substitutions,
                    event calendars, and room reservations—features that often exist as separate or missing components in many institutions.
                </p>
                <p>
                    Say goodbye to fragmented systems and hello to an efficient, all-in-one platform for better organization,
                    smoother operations, and enhanced productivity! 🚀
                </p>
            </div>
        </>
    );
}