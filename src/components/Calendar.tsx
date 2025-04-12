import { useEffect, useState } from 'react'
import { EventInput } from '@fullcalendar/core'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import { Appointments } from '../shared/classes/appointments'
import { Presentators } from '../shared/classes/presentators'
import { AppointmentCard } from './AppointmentCard'
import { Events } from '../shared/classes/events'
import { Institutions } from '../shared/classes/institutions'
import { Event } from './Event'
import { Rooms } from '../shared/classes/rooms'
import { Subjects } from '../shared/classes/subjects'

interface Props {
    institution?: Institutions,
    appointments?: Appointments[],
    presentatorlist?: Presentators[],
    roomlist?: Rooms[],
    subjectlist?: Subjects[],
    type: "main" | "manage"
}

export function Calendar(props: Props) {
    const [events, setEvents] = useState<EventInput[]>([]);
    let token = localStorage.getItem('token');

    useEffect(() => {
        setEvents(convertAppointmentsToEvents(props.appointments! || [], props.institution?.getEvents() || []));
    }, [props.appointments, props.institution?.getEvents()]);


    function convertAppointmentsToEvents(appointments: Appointments[], events: Events[]): EventInput[] {
        let eventlist: EventInput[] = [];
        appointments.map((appointment) => (
            eventlist.push({
                id: appointment.getId(),
                title: appointment.getSubject()?.getName(),
                start: appointment.getStart(),
                end: appointment.getEnd(),
                allDay: false,
                extendedProps: {
                    presentators: appointment.getPresentators(),
                    rooms: appointment.getRooms(),
                    isCancelled: appointment.getIsCancelled(),
                    appointment: appointment
                }
            })
        ));
        events.map((event) => (
            eventlist.push({
                id: event.getId(),
                title: event.getTitle(),
                start: event.getDate(),
                allDay: true,
                extendedProps: {
                    event: event
                }
            })
        ));
        return eventlist;
    }

    const handleEdit = (): boolean => {
        if (localStorage.getItem("role") === "DIRECTOR" && props.type === "manage") {
            return true;
        } else {
            return false;
        }
    }

    function renderEventContent(eventInfo: EventInput) {
        if (eventInfo.event.extendedProps.appointment) {
            return (
                <AppointmentCard
                    appointment={eventInfo.event.extendedProps.appointment}
                    presentatorlist={props.presentatorlist!}
                    roomlist={props.roomlist!}
                    subjectlist={props.subjectlist!}
                    type={props.type}
                />
            )
        } else {
            return (
                <Event event={eventInfo.event.extendedProps.event} />
            )
        }
    }

    async function handleAppointmentTimeChange(id: string, start: Date, end: Date) {
        let app = props.appointments!.find(app => app.getId() === id);
        JSON.parse(app!.getOrigin()!).type;
        if (app) {
            let url = `${import.meta.env.VITE_BASE_URL}/${app.getInstitutionId()!}/${JSON.parse(app!.getOrigin()!).type!}/${JSON.parse(app!.getOrigin()!).id!}/appointments/${app!.getId()!}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ start: start, end: end }),
            });
            if (!response.ok) {
                const data = await response.json();
                if (app.getStart() < new Date()) {
                    alert("You cannot change past appointments!")
                } else {
                    alert(data.message);
                }
            }
            else {
                alert("Apppointment changed successfully!");
            }
        }
    }

    return (
        <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin, timeGridPlugin]}
            headerToolbar={{
                left: 'prev,next today',
                center: 'title',
                right: 'dayGridMonth,timeGridWeek,timeGridDay'
            }}
            initialView="timeGridWeek"
            dayMaxEventRows={2}
            events={events}
            weekends={false}
            nowIndicator={true}
            editable={handleEdit()}
            eventResizableFromStart={true}
            selectable={true}
            eventContent={renderEventContent}
            allDayText="All-day"
            slotLabelFormat={{
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }}
            buttonText={{
                today: "Today",
                month: "Month",
                week: "Week",
                day: "Day"
            }}
            eventChange={(info) => {
                handleAppointmentTimeChange(info.oldEvent.extendedProps.appointment.getId(), info.event._instance!.range.start, info.event._instance!.range.end);
            }}
        />
    )
}
