import { Institutions } from "../../shared/classes/institutions";
import { Events } from "../../shared/classes/events";
import { formatDateForInput } from "../../functions/formatDateForInput";
import { getBearerToken } from "../../functions/utils";
import { useState } from "react";

interface Props {
    institution: Institutions;
    action: "add" | "update";
}

export function ManageEvent(props: Props) {
    const [event, setEvent] = useState<Events | null>(null);
    const [eventtitle, setEventtitle] = useState<string>("");
    const [eventdate, setEventdate] = useState<string>(event?.getDate().toString() || new Date(Date.now()).toString());
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");


    const handleeventsave = async () => {
        setError("");
        setSuccess("");
        let change = 'POST';
        let url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/events`
        if (props.action === "update") {
            change = 'PATCH';
            url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/events/${event?.getId()}`
        }
        if (eventtitle.trim() === "" || eventdate === "") {
            setError("Please fill in all fields");
            return;
        }
        if (new Date(eventdate) < new Date()) {
            setError("Please select a future date");
            return;
        }
        if (eventtitle == event?.getTitle() && new Date(eventdate).toString() == event?.getDate().toString()) {
            setError("No changes made");
            return;
        }
        const response = await fetch(url, {
            method: change,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getBearerToken()}`
            },
            body: JSON.stringify({ title: eventtitle, date: eventdate }),
        });
        if (!response.ok) {
            const data = await response.json();
            setError(data.message);
        }
        else {
            setSuccess("Event saved successfully");
            setEventtitle("");
            setEventdate(new Date(Date.now()).toString());
            setEvent(null);
        }
    }

    const handleeventdelete = async () => {
        if (confirm("Are you sure you want to delete this event?")) {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/events/${event?.getId()}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getBearerToken()}`
                },
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            } else {
                setSuccess("Event deleted successfully");
                props.institution.setEvents(props.institution.getEvents()!.filter((ev: Events) => ev.getId() !== event?.getId()!));
                setEvent(null);
                setEventtitle("");
                setEventdate(new Date(Date.now()).toString());
            }
        } else {
            setError("Event deletion cancelled");
        }
    }

    const handleeventchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const chosenevent = props.institution.getEvents()?.find((event: Events) => event.getId() === e.target.value);
        setEvent(chosenevent!);
        setEventdate(chosenevent?.getDate().toISOString()!);
        setEventtitle(chosenevent?.getTitle()!);
        setError("");
        setSuccess("");
    }

    const inputs = () => {
        return (
            <>
                <label>Event Title: </label><br />
                <input placeholder="Title:" type="text" value={eventtitle} onChange={(e) => setEventtitle(e.target.value)} /><br />
                <label>Event Date: </label><br />
                <input type="datetime-local" value={formatDateForInput(new Date(eventdate))} onChange={(e) => setEventdate(e.target.value)} /><br />
            </>
        )
    }

    return (
        <div className="form-container">
            <h2>{props.action === "update" ? "Update" : "Add"} Event</h2>
            <div className="form-div">
                {
                    props.action === "update" ?
                        <>
                            <select onChange={handleeventchange} value={event?.getId() || 'default'}>
                                <option value="default" disabled>Events</option>
                                {props.institution.getEvents()?.map((event: Events) => (
                                    <option key={event.getId()} value={event.getId()}>{event.getTitle()}</option>
                                ))}
                            </select><br />
                            {event &&
                                <>
                                    {inputs()}
                                </>
                            }
                        </> : <>
                            {inputs()}
                        </>
                }
                {error && <p id="errors">{error}</p>}
                {success && <p id="success">{success}</p>}
                <div className="button-container">
                    <button onClick={handleeventsave}>{props.action === "update" ? "Save" : "Create New"} Event</button>
                    {props.action === "update" && <button onClick={handleeventdelete}>Delete Event</button>}
                </div>
            </div>
        </div>
    )

}