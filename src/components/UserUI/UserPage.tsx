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

    // async function fetchPresentators(waitinstitutions: Institutions[]) {
    //     console.log("fetching presentators")
    //     let presentatorlist = [];
    //     for (let i = 0; i < waitinstitutions.length; i++) {
    //         if (waitinstitutions[i].getAccess() == "PUBLIC") {
    //             const response = await fetch(`http://localhost:3000/institutions/${waitinstitutions[i].getId()}/presentators`)
    //             const presentators = await response.json()
    //             let onepreslist = [];
    //             for (let j = 0; j < presentators.length; j++) {
    //                 let pr: Presentators = new Presentators(presentators[j].id, presentators[j].name, waitinstitutions[i], waitinstitutions[i].getId());
    //                 presentatorlist.push(pr)
    //                 onepreslist.push(pr)
    //             }
    //             waitinstitutions[i].setPresentators(onepreslist);
    //         }
    //     }
    //     setUsePresentators(presentatorlist)
    //     console.log("fetching presentators done")
    // }
    // async function fetchRooms(waitinstitutions: Institutions[]) {
    //     console.log("fetching rooms")
    //     let roomlist = [];
    //     for (let i = 0; i < waitinstitutions.length; i++) {
    //         if (waitinstitutions[i].getAccess() == "PUBLIC") {
    //             const response = await fetch(`http://localhost:3000/institutions/${waitinstitutions[i].getId()}/subjects`)
    //             const rooms = await response.json()
    //             let oneroomlist = [];
    //             for (let j = 0; j < rooms.length; j++) {
    //                 let room: Rooms = new Rooms(rooms[j].id, rooms[j].name, rooms[j].isAvailable, waitinstitutions[i], waitinstitutions[i].getId());
    //                 roomlist.push(room)
    //                 oneroomlist.push(room)
    //             }
    //             waitinstitutions[i].setRooms(oneroomlist);
    //         }
    //     }
    //     setUseRooms(roomlist)
    //     console.log("fetching rooms done")
    // 

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