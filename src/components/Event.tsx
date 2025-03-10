import { Events } from "../shared/classes/events";
import { Institutions } from "../shared/classes/institutions";
import { EventDay } from "./UserUI/EventDay";

interface Props {
    institution: Institutions;
}

export function Event(props: Props) {
    return (
        <>
            <div className="events-container">
                <h4>Events:</h4>
                <div className="events-card-container">
                    {props.institution && props.institution.getEvents() && props.institution.getEvents()!.length > 0 ? (
                        props.institution!.getEvents()?.map((event: Events) => (
                            <EventDay key={event.getId()} event={event} />
                        ))
                    ) : (
                        <div className="event-card" title="No events for today!">
                            <h3><b>Nothing :)</b></h3>
                            <div className="event-container">
                                <p>No events for today!</p>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}