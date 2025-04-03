import { Users } from "../shared/classes/users";
import { Appointments } from "../shared/classes/appointments";
import { Events } from "../shared/classes/events";
import { Institutions } from "../shared/classes/institutions";
import { Presentators } from "../shared/classes/presentators";
import { Rooms } from "../shared/classes/rooms";
import { Subjects } from "../shared/classes/subjects";
import { Timetables } from "../shared/classes/timetables";

let token = localStorage.getItem('token') || "";
const headers = { 'Authorization': `Bearer ${token}` };

export async function fetchInstitutions() {
    let instlist: Institutions[] = [];
    let url = `${import.meta.env.VITE_BASE_URL}`;
    const response = await fetch(url, { headers });
    const institutions = await response.json()
    for (let i = 0; i < institutions.length; i++) {
        let ins: Institutions = new Institutions(institutions[i].id, institutions[i].name, institutions[i].type, institutions[i].access, institutions[i].color, institutions[i].website);
        instlist.push(ins);
    }
    console.log(instlist);
    return instlist.sort((a: Institutions, b: Institutions) => a.getName().localeCompare(b.getName()));
}

export async function fetchManageInstitutions() {
    let ins = JSON.parse(localStorage.getItem("institutions")!);
    let instlist = [];
    for (let i = 0; i < ins.length; i++) {
        let url = `${import.meta.env.VITE_BASE_URL}/${ins[i].institutionId}`;
        const response = await fetch(url, { headers });
        const fetchedinstitution = await response.json();
        let institution: Institutions = new Institutions(fetchedinstitution.id, fetchedinstitution.name, fetchedinstitution.type, fetchedinstitution.access, fetchedinstitution.color, fetchedinstitution.website);
        instlist.push(institution);
    }
    console.log(instlist);
    return instlist.sort((a: Institutions, b: Institutions) => a.getName().localeCompare(b.getName()));
}

export async function fetchTimetables(selectedinstitution: Institutions) {
    try {
        let timetablelist = [];
        let error = [];
        let url = `${import.meta.env.VITE_BASE_URL}/${selectedinstitution.getId()}/timetables`;
        const response = await fetch(url, { headers })
        const timetables = await response.json()
        if (response.status === 403) {
            error.push("You no not have permission to view this institution's timetables!");
        } else if (response.status === 400) {
            error.push("There was an error fetching timetables! Please try again.")
        }
        for (let i = 0; i < timetables.length; i++) {
            let timetable: Timetables = new Timetables(timetables[i].id, timetables[i].name, selectedinstitution, selectedinstitution.getId());
            timetablelist.push(timetable)
        }
        selectedinstitution.setTimetables(timetablelist);
        const data = {
            timetables: timetablelist.sort((a, b) => a.getName().localeCompare(b.getName())),
            error: error
        };
        return data;
    } catch (error) { }
}

export async function fetchPresentators(selectedinstitution: Institutions) {
    try {
        let presentatorlist = [];
        let url = `${import.meta.env.VITE_BASE_URL}/${selectedinstitution.getId()}/presentators`
        const response = await fetch(url, { headers })
        let error = [];
        if (!response.ok) {
            error.push("There was an error fetching presentators! Please try again.")
        }
        const presentators = await response.json()
        for (let i = 0; i < presentators.length; i++) {
            presentatorlist.push(new Presentators(presentators[i].id, presentators[i].name, selectedinstitution.getId()));
        }
        selectedinstitution.setPresentators(presentatorlist);
        const data = {
            presentators: presentatorlist.sort((a, b) => a.getName().localeCompare(b.getName())),
            error: error
        };
        return data;
    } catch (error) { }
}

export async function fetchRooms(selectedinstitution: Institutions) {
    try {
        let roomlist = [];
        let url = `${import.meta.env.VITE_BASE_URL}/${selectedinstitution.getId()}/rooms`
        const response = await fetch(url, { headers })
        let error = [];
        if (!response.ok) {
            error.push("There was an error fetching rooms! Please try again.")
        }
        const rooms = await response.json()
        for (let i = 0; i < rooms.length; i++) {
            roomlist.push(new Rooms(rooms[i].id, rooms[i].name, rooms[i].isAvailable, selectedinstitution.getId()));
        }
        selectedinstitution.setRooms(roomlist);
        const data = {
            rooms: roomlist.sort((a, b) => a.getName().localeCompare(b.getName())),
            error: error
        };
        return data;
    } catch (error) { }
}

export async function fetchEvents(selectedinstitution: Institutions) {
    try {
        let eventlist = [];
        let url = `${import.meta.env.VITE_BASE_URL}/${selectedinstitution.getId()}/events`
        const response = await fetch(url, { headers })
        let error = [];
        if (!response.ok) {
            error.push("There was an error fetching events! Please try again.")
        }
        const events = await response.json()
        for (let i = 0; i < events.length; i++) {
            eventlist.push(new Events(events[i].id, events[i].title, events[i].date, selectedinstitution.getId()));
        }
        selectedinstitution.setEvents(eventlist.sort((a, b) => a.getDate().getTime() - b.getDate().getTime()));
        return error;
    } catch (error) { }
}

export async function fetchSubjects(selectedinstitution: Institutions) {
    try {
        let subjectlist = [];
        let url = `${import.meta.env.VITE_BASE_URL}/${selectedinstitution.getId()}/subjects`
        const response = await fetch(url, { headers })
        let error = [];
        if (!response.ok) {
            error.push("There was an error fetching subjects! Please try again.");
        }
        const subjects = await response.json()
        for (let i = 0; i < subjects.length; i++) {
            subjectlist.push(new Subjects(subjects[i].id, subjects[i].name, subjects[i].subjectId, selectedinstitution.getId()));
        }
        selectedinstitution.setSubjects(subjectlist);
        return error;
    } catch (error) { }
}

export async function fetchUsers(selectedinstitution: Institutions) {
    try {
        let userlist = [];
        let url = `${import.meta.env.VITE_BASE_URL}/${selectedinstitution.getId()}/users`
        const response = await fetch(url, { headers })
        let error = [];
        if (!response.ok) {
            error.push("There was an error fetching users! Please try again.")
        }
        const users = await response.json()
        console.log(users)
        for (let i = 0; i < users.length; i++) {
            userlist.push(new Users(users[i].email, users[i].role));
        }
        selectedinstitution.setUsers(userlist);
        return error;
    } catch (error) { }
}

export async function fetchTimetableAppointments(selectedttablelist: Timetables[], selectedinstitution: Institutions) {
    try {
        for (let f = 0; f < selectedttablelist.length; f++) {
            let url = `${import.meta.env.VITE_BASE_URL}/${selectedttablelist[f].getInstitutionId()}/timetables/${selectedttablelist[f].getId()}/appointments`
            const response = await fetch(url, { headers })
            const appointments = await response.json()
            let oneapplist = [];
            for (let i = 0; i < appointments.length; i++) {
                let oneroomlist = [];
                let onepreslist = [];
                for (let j = 0; j < appointments[i].rooms.length; j++) {
                    oneroomlist.push(new Rooms(appointments[i].rooms[j].id, appointments[i].rooms[j].name, appointments[i].rooms[j].isAvailable, appointments[i].rooms[j].institutionId));
                }
                for (let j = 0; j < appointments[i].presentators.length; j++) {
                    let pres: Presentators = new Presentators(appointments[i].presentators[j].id, appointments[i].presentators[j].name, appointments[i].presentators[j].institutionId);
                    pres.setIsSubstituted(appointments[i].presentators[j].isSubstituted);
                    onepreslist.push(pres);
                }
                let subject: Subjects = new Subjects(appointments[i].subject.id, appointments[i].subject.name, appointments[i].subject.subjectId, appointments[i].subject.institutionId);
                let appointment: Appointments = new Appointments(appointments[i].id, subject, onepreslist, oneroomlist, appointments[i].start, appointments[i].end, appointments[i].isCancelled)
                appointment.setOrigin(JSON.stringify({ type: "timetables", id: selectedttablelist[f].getId()! }))
                appointment.setInstitutionId(selectedinstitution.getId()!)
                oneapplist.push(appointment);
            }
            selectedttablelist[f].setAppointments(oneapplist)
        }
    } catch (error) { }
}

export async function fetchPresentatorAppointments(selectedpresentatorlist: Presentators[], selectedinstitution: Institutions) {
    try {
        for (let f = 0; f < selectedpresentatorlist.length; f++) {
            let url = `${import.meta.env.VITE_BASE_URL}/${selectedpresentatorlist[f].getInstitutionId()}/presentators/${selectedpresentatorlist[f].getId()}/appointments`
            const response = await fetch(url, { headers })
            const appointments = await response.json()
            let oneapplist = [];
            for (let i = 0; i < appointments.length; i++) {
                let oneroomlist = [];
                let onepreslist = [];
                for (let j = 0; j < appointments[i].rooms.length; j++) {
                    oneroomlist.push(new Rooms(appointments[i].rooms[j].id, appointments[i].rooms[j].name, appointments[i].rooms[j].isAvailable, appointments[i].rooms[j].institutionId));
                }
                for (let j = 0; j < appointments[i].presentators.length; j++) {
                    let pres: Presentators = new Presentators(appointments[i].presentators[j].id, appointments[i].presentators[j].name, appointments[i].presentators[j].institutionId);
                    pres.setIsSubstituted(appointments[i].presentators[j].isSubstituted);
                    onepreslist.push(pres);
                }
                let subject: Subjects = new Subjects(appointments[i].subject.id, appointments[i].subject.name, appointments[i].subject.subjectId, appointments[i].subject.institutionId);
                let appointment: Appointments = new Appointments(appointments[i].id, subject, onepreslist, oneroomlist, appointments[i].start, appointments[i].end, appointments[i].isCancelled)
                appointment.setOrigin(JSON.stringify({ type: "presentators", id: selectedpresentatorlist[f].getId() }))
                appointment.setInstitutionId(selectedinstitution.getId()!)
                oneapplist.push(appointment);
            }
            selectedpresentatorlist[f].setAppointments(oneapplist)
        }
    } catch (error) { }
}

export async function fetchRoomAppointments(selectedroomlist: Rooms[], selectedinstitution: Institutions) {
    try {
        for (let f = 0; f < selectedroomlist.length; f++) {
            let url = `${import.meta.env.VITE_BASE_URL}/${selectedroomlist[f].getInstitutionId()}/rooms/${selectedroomlist[f].getId()}/appointments`
            const response = await fetch(url, { headers })
            const appointments = await response.json()
            let oneapplist = [];
            for (let i = 0; i < appointments.length; i++) {
                let oneroomlist = [];
                let onepreslist = [];
                for (let j = 0; j < appointments[i].rooms.length; j++) {
                    oneroomlist.push(new Rooms(appointments[i].rooms[j].id, appointments[i].rooms[j].name, appointments[i].rooms[j].isAvailable, appointments[i].rooms[j].institutionId));
                }
                for (let j = 0; j < appointments[i].presentators.length; j++) {
                    let pres: Presentators = new Presentators(appointments[i].presentators[j].id, appointments[i].presentators[j].name, appointments[i].presentators[j].institutionId);
                    pres.setIsSubstituted(appointments[i].presentators[j].isSubstituted);
                    onepreslist.push(pres);
                }
                let subject: Subjects = new Subjects(appointments[i].subject.id, appointments[i].subject.name, appointments[i].subject.subjectId, appointments[i].subject.institutionId);
                let appointment: Appointments = new Appointments(appointments[i].id, subject, onepreslist, oneroomlist, appointments[i].start, appointments[i].end, appointments[i].isCancelled)
                appointment.setOrigin(JSON.stringify({ type: "rooms", id: selectedroomlist[f].getId() }))
                appointment.setInstitutionId(selectedinstitution.getId()!)
                oneapplist.push(appointment);
            }
            selectedroomlist[f].setAppointments(oneapplist)
        }
    } catch (error) { }
}

export async function fetchAvailableRooms(appointment: Appointments, institutionId: string) {
    try {
        let roomlist = [];
        let url = `${import.meta.env.VITE_BASE_URL}/${institutionId}/${JSON.parse(appointment!.getOrigin()!).type!}/${JSON.parse(appointment!.getOrigin()!).id!}/appointments/${appointment!.getId()!}/rooms/available`
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
        })
        const rooms = await response.json()
        for (let i = 0; i < rooms.length; i++) {
            let room: Rooms = new Rooms(rooms[i].id, rooms[i].name, rooms[i].isAvailable, rooms[i].institutionId);
            roomlist.push(room);
        }
        return roomlist.sort((a, b) => a.getName().localeCompare(b.getName()));
    } catch (error) { }
}

export async function fetchAvailablePresentators(appointment: Appointments, institutionId: string) {
    try {
        let presentatorlist = [];
        let url = `${import.meta.env.VITE_BASE_URL}/${institutionId}/${JSON.parse(appointment!.getOrigin()!).type!}/${JSON.parse(appointment!.getOrigin()!).id!}/appointments/${appointment!.getId()!}/presentators/available`
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
        })
        const presentators = await response.json()
        for (let i = 0; i < presentators.length; i++) {
            presentatorlist.push(new Presentators(presentators[i].id, presentators[i].name, presentators[i].institutionId));
        }
        return presentatorlist.sort((a, b) => a.getName().localeCompare(b.getName()));
    } catch (error) { }
}