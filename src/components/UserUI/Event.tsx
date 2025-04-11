import { Events } from "../../shared/classes/events";

interface Props {
    event: Events;
}

export function Event(props: Props) {
    return (
        <>
            <div className="event-card" title={`${props.event?.getTitle()} - ${props.event?.getDate().toDateString()}`} >
                <h3><b>{props.event?.getTitle()}</b></h3>
                <div className="event-container">
                    <p>{props.event?.getDate().toDateString()}</p>
                </div>
            </div>
        </>
    )
}