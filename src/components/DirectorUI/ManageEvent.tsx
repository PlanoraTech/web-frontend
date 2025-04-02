import { useEffect, useState } from "react";
import { Institutions } from "../../shared/classes/institutions";
import { Events } from "../../shared/classes/events";
import { getTokenUrl } from "../../functions/getTokenUrl";

interface Props {
    institution: Institutions;
    action: "add" | "update";
}

export function ManageEvent(props: Props) {
    const [eventtitle, setEventtitle] = useState<string>("");
    const [eventdate, setEventdate] = useState<string>("");
    const [event, setEvent] = useState<Events | null>(null);
    const [action, setAction] = useState<"add" | "update">("add");
    const [error, setError] = useState<string>("");

    useEffect(() => {
        if (props.action === "update") {
            setAction("update");
        }
    }, [event])

    const handlechangeevent = async () => {
        let change = 'POST';
        let url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/events/${getTokenUrl()}`
        if (action === "update") {
            change = 'PATCH';
            url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/events/${event?.getId()}/${getTokenUrl()}`
        }
        if (eventtitle === "" || eventdate === "") {
            setError("Please fill in all fields");
        } else {
            const response = await fetch(url, {
                method: change,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ title: eventtitle, date: eventdate }),
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            }
            else {
                console.log(response);
                setError("");
                setEventtitle("");
                setEventdate("");
            }
        }
    }

    const handleeventchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const event = props.institution.getEvents()?.find((event: Events) => event.getId() === e.target.value);
        setEventtitle(event!.getTitle());
        setEvent(event!);
    }

    return (
        <div className="form-container">
            <h2>{action === "update" ? "Update" : "Add"} Event</h2>
            <div className="form-div">
                {
                    action === "update" ?
                        <>
                            <select onChange={handleeventchange} value={event?.getId() || 'default'}>
                                <option value="default" disabled>Timetables</option>
                                {props.institution.getEvents()?.map((event: Events) => (
                                    <option key={event.getId()} value={event.getId()}>{event.getTitle()}</option>
                                ))}
                            </select><br />
                            <label>Event Title: </label><br />
                            <input placeholder="Title:" type="text" value={eventtitle} onChange={(e) => setEventtitle(e.target.value)} /><br />
                            <label>Event Date: </label><br />
                            <input placeholder="date" type="datetime" value={eventdate} onChange={(e) => setEventdate(e.target.value)} /><br />
                        </> : <>
                            <label>Event Title: </label><br />
                            <input placeholder="Title:" type="text" value={eventtitle} onChange={(e) => setEventtitle(e.target.value)} /><br />
                            <label>Event Date: </label><br />
                            <input placeholder="date" type="datetime" value={eventdate} onChange={(e) => setEventdate(e.target.value)} /><br />
                        </>
                }
                <p id="errors">{error}</p>
                <div className="button-container">
                    <button onClick={handlechangeevent}>{action === "update" ? "Save" : "Create New"} Event</button>
                </div>
            </div>
        </div>
    )

}