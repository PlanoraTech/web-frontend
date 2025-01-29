import { useState, useEffect } from "react"
import { Appointments } from "../../shared/classes/appointments"
import { Institutions } from "../../shared/classes/institutions"
import { Nav } from "../Nav"
import { Schedule } from "./Schedule"
import { Presentators } from "../../shared/classes/presentators"
import { Rooms } from "../../shared/classes/rooms"
import { Timetables } from "../../shared/classes/timetables"


export function UserPage() {
    const [institutions, setInstitutions] = useState<Institutions[]>([])
    const [presentators, setUsePresentators] = useState<Presentators[]>()
    const [rooms, setUseRooms] = useState<Rooms[]>()
    const [timetables, setUseTimetables] = useState<Timetables[]>()
    const [appointments, setUseAppointments] = useState<Appointments[]>()

    useEffect(() => {

        async function fetchInstitutions() {
            console.log("fetching institutions")
            let instlist = [];
            const response = await fetch('http://localhost:3000/institutions')
            const institutions = await response.json()
            for (let i = 0; i < institutions.length; i++) {
                let ins: Institutions = new Institutions(institutions[i].id, institutions[i].name, institutions[i].type, institutions[i].access, institutions[i].color, institutions[i].website);
                instlist.push(ins);
            }
            setInstitutions(instlist)
            console.log(instlist);
            console.log("fetching institutions done")
        }

        fetchInstitutions();
    }, [])

    return (
        <>
            <Nav />
            <Schedule institution={institutions} />
        </>
    )
}