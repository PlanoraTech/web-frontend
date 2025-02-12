import { useState, useEffect } from "react"
import { Institutions } from "../../shared/classes/institutions"
import { Nav } from "../Nav"
import { Schedule } from "./Schedule"

export function UserPage() {
    const [institutions, setInstitutions] = useState<Institutions[]>([])

    useEffect(() => {
        async function fetchInstitutions() {
            let instlist = [];
            let url = `http://localhost:3000/institutions`;
            if (localStorage.getItem('token')) {
                url = `http://localhost:3000/institutions?token=${localStorage.getItem('token')}`
            }
            const response = await fetch(url)
            const institutions = await response.json()
            for (let i = 0; i < institutions.length; i++) {
                let ins: Institutions = new Institutions(institutions[i].id, institutions[i].name, institutions[i].type, institutions[i].access, institutions[i].color, institutions[i].website);
                instlist.push(ins);
            }
            setInstitutions(instlist)
            console.log(instlist);
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