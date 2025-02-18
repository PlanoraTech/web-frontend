import { useEffect, useState } from "react"
import { Nav } from "../Nav"
import { Institutions } from "../../shared/classes/institutions"


export function Menu() {
    const [institutions, setInstitutions] = useState<Institutions[]>([])
    const baseUrl = 'http://localhost:3000/institutions';

    useEffect(() => {
        fetchInstitutions();
    }, [])

    async function fetchInstitutions() {
        let ins = JSON.parse(localStorage.getItem("institutions")!);
        for (let i = 0; i < ins.length; i++) {
            let url = `${baseUrl}/${ins[i].id}`;
            if (localStorage.getItem('token')) {
                url = `${baseUrl}/${ins[i].id}?token=${localStorage.getItem('token')}`
            }
            let instlist = [];
            const response = await fetch(url)
            const institutions = await response.json()
            console.log(institutions);
            for (let j = 0; j < institutions.length; j++) {
                let institution: Institutions = new Institutions(institutions[j].id, institutions[j].name, institutions[j].type, institutions[j].access, institutions[j].color, institutions[j].website);
                instlist.push(institution);
            }
            setInstitutions(instlist.sort((a: Institutions, b: Institutions) => a.getName().localeCompare(b.getName())));
            console.log(instlist);
        }
    }

    return (
        <div>
            <Nav />
            <h1>directors menu</h1>
        </div>
    )
}