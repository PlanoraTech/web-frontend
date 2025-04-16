import { Events } from "../shared/classes/events";

interface Props {
    event: Events;
}

export function Event(props: Props) {
    return (
        <>
            <div id="event-card" title={`${props.event?.getTitle()} - ${props.event?.getDate().toDateString()}`} >
                <h3><b>{props.event?.getTitle()}</b></h3>
                <div id="event-container">
                    <p>{props.event?.getDate().toDateString()}</p>
                </div>
            </div>
        </>
    )
}