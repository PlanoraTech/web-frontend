// Import necessary classes
import { Users } from "../shared/classes/users";
import { Appointments } from "../shared/classes/appointments";
import { Events } from "../shared/classes/events";
import { Institutions } from "../shared/classes/institutions";
import { Presentators } from "../shared/classes/presentators";
import { Rooms } from "../shared/classes/rooms";
import { Subjects } from "../shared/classes/subjects";
import { Timetables } from "../shared/classes/timetables";

// Handle token from local storage
let token = localStorage.getItem('token') || "";
const headers = { 'Authorization': `Bearer ${token}` };

// Fetch institutions
export async function fetchInstitutions() {
    const url = `${import.meta.env.VITE_BASE_URL}`;
    const response = await fetch(url, { headers });
    const institutions = await response.json();
    const instlist = institutions.map((institution: any) =>
        new Institutions(institution.id, institution.name, institution.type, institution.access, institution.color, institution.website)
    );
    return (instlist as Institutions[]).sort((a, b) => a.getName().localeCompare(b.getName()));
}

// Fetch institutions for management
export async function fetchManageInstitutions() {
    const ins = JSON.parse(localStorage.getItem("institutions")!);
    const instlist = await Promise.all(ins.map(async (institutionData: any) => {
        const url = `${import.meta.env.VITE_BASE_URL}/${institutionData.institutionId}`;
        const response = await fetch(url, { headers });
        const fetchedinstitution = await response.json();
        return new Institutions(fetchedinstitution.id, fetchedinstitution.name, fetchedinstitution.type, fetchedinstitution.access, fetchedinstitution.color, fetchedinstitution.website);
    }));
    return instlist.sort((a, b) => a.getName().localeCompare(b.getName()));
}

// Fetch timetables for a selected institution
export async function fetchTimetables(selectedinstitution: Institutions) {
    return fetchData(selectedinstitution, "timetables", (item, institutionId) => new Timetables(item.id, item.name, selectedinstitution, institutionId), (items) => selectedinstitution.setTimetables(items));
}

// Fetch presentators for a selected institution
export async function fetchPresentators(selectedinstitution: Institutions) {
    return fetchData(selectedinstitution, "presentators", (item, institutionId) => new Presentators(item.id, item.name, institutionId), (items) => selectedinstitution.setPresentators(items));
}

// Fetch rooms for a selected institution
export async function fetchRooms(selectedinstitution: Institutions) {
    return fetchData(selectedinstitution, "rooms", (item, institutionId) => new Rooms(item.id, item.name, item.isAvailable, institutionId), (items) => selectedinstitution.setRooms(items));
}

// Fetch events for a selected institution
export async function fetchEvents(selectedinstitution: Institutions) {
    return fetchData(selectedinstitution, "events", (item, institutionId) => new Events(item.id, item.title, item.date, institutionId), (items) => selectedinstitution.setEvents(items));
}

// Fetch subjects for a selected institution
export async function fetchSubjects(selectedinstitution: Institutions) {
    return fetchData(selectedinstitution, "subjects", (item, institutionId) => new Subjects(item.id, item.name, item.subjectId, institutionId), (items) => selectedinstitution.setSubjects(items));
}

// Fetch users for a selected institution
export async function fetchUsers(selectedinstitution: Institutions) {
    return fetchData(selectedinstitution, "users", (item) => new Users(item.id, item.email), (items) => selectedinstitution.setUsers(items));
}

// Fetch timetable appointments for a selected timetable and institution
export async function fetchTimetableAppointments(selectedttable: Timetables, selectedinstitution: Institutions) {
    return await fetchAppointmentsData(selectedttable, `timetables/${selectedttable.getId()}/appointments`,
        (appointments) => appointments.map(appointment => {
            let appt = makeAppointments(appointment);
            appt.setOrigin(JSON.stringify({ type: "timetables", id: selectedttable.getId() }));
            appt.setInstitutionId(selectedinstitution.getId()!);
            return appt;
        }), (items) => selectedttable.setAppointments(items));
}

// Fetch presentator appointments for a selected presentator and institution
export async function fetchPresentatorAppointments(selectedpresentator: Presentators, selectedinstitution: Institutions) {
    return await fetchAppointmentsData(selectedpresentator, `presentators/${selectedpresentator.getId()}/appointments`,
        (appointments) => appointments.map(appointment => {
            let appt = makeAppointments(appointment);
            appt.setOrigin(JSON.stringify({ type: "presentators", id: selectedpresentator.getId() }));
            appt.setInstitutionId(selectedinstitution.getId()!);
            return appt;
        }), (items) => selectedpresentator.setAppointments(items));
}

// Fetch room appointments for a selected room and institution
export async function fetchRoomAppointments(selectedroom: Rooms, selectedinstitution: Institutions) {
    return await fetchAppointmentsData(selectedroom, `rooms/${selectedroom.getId()}/appointments`,
        (appointments) => appointments.map(appointment => {
            let appt = makeAppointments(appointment);
            appt.setOrigin(JSON.stringify({ type: "rooms", id: selectedroom.getId() }));
            appt.setInstitutionId(selectedinstitution.getId()!);
            return appt;
        }), (items) => selectedroom.setAppointments(items));
}

// Fetch available rooms for a specific appointment
export async function fetchAvailableRooms(appointment: Appointments, institutionId: string) {
    try {
        const url = `${import.meta.env.VITE_BASE_URL}/${institutionId}/${JSON.parse(appointment!.getOrigin()!).type!}/${JSON.parse(appointment!.getOrigin()!).id!}/appointments/${appointment!.getId()!}/rooms/available`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
        });
        const rooms = await response.json();
        const roomlist = rooms.map((room: any) => new Rooms(room.id, room.name, room.isAvailable, room.institutionId));
        return (roomlist as Rooms[]).sort((a, b) => a.getName().localeCompare(b.getName()));
    } catch (error) { }
}

// Fetch available presentators for a specific appointment
export async function fetchAvailablePresentators(appointment: Appointments, institutionId: string) {
    try {
        const url = `${import.meta.env.VITE_BASE_URL}/${institutionId}/${JSON.parse(appointment!.getOrigin()!).type!}/${JSON.parse(appointment!.getOrigin()!).id!}/appointments/${appointment!.getId()!}/presentators/available`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...headers
            },
        });
        const presentators = await response.json();
        const presentatorlist = presentators.map((presentator: any) =>
            new Presentators(presentator.id, presentator.name, presentator.institutionId)
        );
        return (presentatorlist as Presentators[]).sort((a, b) => a.getName().localeCompare(b.getName()));
    } catch (error) { }
}

// Helper function to create appointments from raw data
function makeAppointments(appointment: any) {
    let oneroomlist = [];
    let onepreslist = [];
    for (let j = 0; j < appointment.rooms.length; j++) {
        oneroomlist.push(new Rooms(appointment.rooms[j].id, appointment.rooms[j].name, appointment.rooms[j].isAvailable, appointment.rooms[j].institutionId));
    }
    for (let j = 0; j < appointment.presentators.length; j++) {
        let pres: Presentators = new Presentators(appointment.presentators[j].id, appointment.presentators[j].name, appointment.presentators[j].institutionId);
        pres.setIsSubstituted(appointment.presentators[j].isSubstituted);
        onepreslist.push(pres);
    }
    let subject: Subjects = new Subjects(appointment.subject.id, appointment.subject.name, appointment.subject.subjectId, appointment.subject.institutionId);
    return new Appointments(appointment.id, subject, onepreslist, oneroomlist, appointment.start, appointment.end, appointment.isCancelled)
}

// Fetch general data for selected institution and endpoint
export async function fetchData<T>(selectedinstitution: Institutions, endpoint: string, mapFunction: (item: any, institutionId: string) => T, setter: (items: T[]) => void) {
    try {
        const url = `${import.meta.env.VITE_BASE_URL}/${selectedinstitution.getId()}/${endpoint}`;
        const response = await fetch(url, { headers });
        let error: string[] = [];
        if (response.status === 403) {
            error.push("You do not have permission to view this institution's timetables!");
        }
        if (!response.ok) {
            error.push(`There was an error fetching ${endpoint}! Please try again.`);
        }
        const data = await response.json();
        const itemList = data.map((item: any) => mapFunction(item, selectedinstitution.getId()));
        setter(itemList);
        return { items: itemList, error };
    } catch (err) { }
}

// Fetch appointments data for a specific entity (timetables, presentators, rooms)
async function fetchAppointmentsData<T extends { getInstitutionId: () => string }>(entity: T, endpoint: string, makeAppointmentFn: (appointments: any[]) => Appointments[], setAppointmentsFn: (items: Appointments[]) => void) {
    try {
        const url = `${import.meta.env.VITE_BASE_URL}/${entity.getInstitutionId()!}/${endpoint}`;
        const response = await fetch(url, { headers });
        const appointmentsData = await response.json();
        const appointments = makeAppointmentFn(appointmentsData);
        setAppointmentsFn(appointments);
        return appointments;
    } catch (error) { }
}