import { useEffect, useState } from "react";
import { Institutions } from "../../shared/classes/institutions";
import { Events } from "../../shared/classes/events";
import { formatDateForInput } from "../../functions/formatDateForInput";

interface Props {
    institution: Institutions;
    action: "add" | "update";
}

export function ManageEvent(props: Props) {
    const [event, setEvent] = useState<Events | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<Events | null>(null);
    const [eventtitle, setEventtitle] = useState<string>("");
    const [eventdate, setEventdate] = useState<string>(new Date(Date.now()).toISOString()!);
    const [selectedEventtitle, setSelectedEventtitle] = useState<string>(selectedEvent?.getTitle()!);
    const [selectedEventdate, setSelectedEventdate] = useState<string>(selectedEvent?.getDate().toISOString()!);
    const [action, setAction] = useState<"add" | "update">("add");
    const [error, setError] = useState<string>("");
    let token = localStorage.getItem('token');
    //'Authorization': `Bearer ${token}`

    useEffect(() => {
        if (props.action === "update") {
            setAction("update");
        }
    }, [selectedEvent])

    const handleeventsave = async () => {
        let change = 'POST';
        let url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/events`
        if (action === "update") {
            change = 'PATCH';
            url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/events/${event?.getId()}`
        }
        if (action == "add") {
            if (eventtitle === "" || eventdate === "") {
                setError("Please fill in all fields");
            }
            if (eventdate < new Date(Date.now()).toISOString()) {
                setError("Please select a valid date");
            }
        } else {
            if (selectedEventtitle === "" || selectedEventdate === "") {
                setError("Please fill in all fields");
            }
            if (selectedEventdate < new Date(Date.now()).toISOString()) {
                setError("Please select a valid date");
            }
        }
        if (error == "") {
            const response = await fetch(url, {
                method: change,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: action == "update" ? JSON.stringify({ title: selectedEventtitle, date: selectedEventdate }) : JSON.stringify({ title: eventtitle, date: eventdate }),
            });
            if (!response.ok) {
                const data = await response.json();
                console.log(data);
                setError(data.message);
            }
            else {
                console.log(response);

                setError("Event saved successfully");
                setEventtitle("");
                setEventdate("");
                setEvent(null)
                setSelectedEvent(null)
                setSelectedEventdate("")
                setSelectedEventtitle("")
            }
        }
    }

    const handleeventdelete = async () => {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/events/${selectedEvent?.getId()}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            const data = await response.json();
            setError(data.message);
        } else {
            setError("Event deleted successfully");
            setSelectedEvent(null);
            setSelectedEventtitle("");
            setSelectedEventdate("");
            props.institution.setEvents(props.institution.getEvents()!.filter((event: Events) => event.getId() !== selectedEvent?.getId()!));
        }
    }

    const handleeventchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const chosenevent = props.institution.getEvents()?.find((event: Events) => event.getId() === e.target.value);
        setSelectedEvent(chosenevent!);
        setSelectedEventdate(chosenevent?.getDate().toISOString()!);
        setSelectedEventtitle(chosenevent?.getTitle()!);
        setError("");
    }

    return (
        <div className="form-container">
            <h2>{action === "update" ? "Update" : "Add"} Event</h2>
            <div className="form-div">
                {
                    action === "update" ?
                        <>
                            <select onChange={handleeventchange} value={selectedEvent?.getId() || 'default'}>
                                <option value="default" disabled>Events</option>
                                {props.institution.getEvents()?.map((event: Events) => (
                                    <option key={event.getId()} value={event.getId()}>{event.getTitle()}</option>
                                ))}
                            </select><br />
                            {selectedEvent &&
                                <>
                                    <label>Event Title: </label><br />
                                    <input placeholder="Title:" type="text" value={selectedEventtitle} onChange={(e) => setSelectedEventtitle(e.target.value)} /><br />
                                    <label>Event Date: </label><br />
                                    <input type="datetime-local" value={formatDateForInput(new Date(selectedEventdate))} onChange={(e) => setSelectedEventdate(e.target.value)} /><br />
                                </>
                            }
                        </> : <>
                            <label>Event Title: </label><br />
                            <input placeholder="Title:" type="text" value={eventtitle} onChange={(e) => setEventtitle(e.target.value)} /><br />
                            <label>Event Date: </label><br />
                            <input placeholder="date" type="datetime-local" value={formatDateForInput(new Date(eventdate))} onChange={(e) => setEventdate(e.target.value)} /><br />
                        </>
                }
                <p id="errors">{error}</p>
                <div className="button-container">
                    <button onClick={handleeventsave}>{action === "update" ? "Save" : "Create New"} Event</button>
                    {action === "update" && <button onClick={handleeventdelete}>Delete Event</button>}
                </div>
            </div>
        </div>
    )

}