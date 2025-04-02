import { useState, useEffect } from "react"
import { Institutions } from "../../shared/classes/institutions"
import { Nav } from "../Nav"
import { Schedule } from "./Schedule"
import { fetchInstitutions } from "../../functions/fetches"

export function UserPage() {
    const [institutions, setInstitutions] = useState<Institutions[]>([])

    useEffect(() => {
        async function getinstitutions() {
            let inslist = await fetchInstitutions();
            setInstitutions(inslist)
        }
        getinstitutions()
    }, [])

    return (
        <>
            <Nav />
            <Schedule institution={institutions} />
        </>
    )
}