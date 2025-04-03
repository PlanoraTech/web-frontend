import { useEffect, useRef, useState } from "react";
import { Appointments } from "../../shared/classes/appointments"
import { Presentators } from "../../shared/classes/presentators";
import { AppointmentPopOver } from "../AppointmentPopOver";
import ReactDOM from "react-dom";
import { getTimeWithZeros } from "../../functions/getTimeWithZeros";
import { Subjects } from "../../shared/classes/subjects";
import { Rooms } from "../../shared/classes/rooms";
import { CostumCheckbox } from "../CostumCheckbox";

interface Props {
    appointment: Appointments;
    presentatorlist: Presentators[];
    roomlist: Rooms[];
    subjectlist: Subjects[];
    type: "main" | "manage";
}

export function AppointmentCard(props: Props) {
    const [showpopover, setPopover] = useState(false);
    const [iscancelled, setIscancelled] = useState(false);
    const [iswaiting, setIsWaiting] = useState(props.appointment?.getIsCancelled() || false);
    const [issubstituted, setIsSubstituted] = useState(props.appointment?.getPresentators()?.find(pres => pres.getId() === localStorage.getItem("presentatorid"))?.getIsSubstituted()!);
    const [ispresentatorsappointment, setIsPresentatorsAppointment] = useState(false);
    const [isdirector, setIsDirector] = useState(false);
    const [ispart, setIsPart] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [_, setUpdate] = useState(false);
    const hoverTimeout = useRef<number | null>(null);
    const rootStyles = getComputedStyle(document.documentElement);
    const dark_text = rootStyles.getPropertyValue("--dark-text");
    const light_text = rootStyles.getPropertyValue("---light-text");

    let token = localStorage.getItem('token');

    useEffect(() => {
        let ins = JSON.parse(localStorage.getItem("institutions")!);
        if (ins) {
            for (let i = 0; i < ins.length; i++) {
                if (ins[i].institutionId === props.appointment?.getInstitutionId()) {
                    setIsPart(true);
                    localStorage.setItem("role", ins[i].role);
                    localStorage.setItem("presentatorid", ins[i].presentatorId);
                }
            }
        }
        if (localStorage.getItem("role") === "DIRECTOR") {
            setIsDirector(true);
        }
        if (localStorage.getItem("role") === "PRESENTATOR" && props.appointment?.getPresentators()?.find(pres => pres.getId() === localStorage.getItem("presentatorid"))) {
            setIsPresentatorsAppointment(true);
        }
        let numberofpresentators = 0;
        for (let i = 0; i < props.appointment.getPresentators()!.length; i++) {
            if (props.appointment.getPresentators()![i].getIsSubstituted() === true) {
                numberofpresentators++;
            }
        }
        if (numberofpresentators === props.appointment.getPresentators()!.length) {
            setIsWaiting(true);
        } else {
            setIsWaiting(false);
        }
        if (iscancelled == true) {
            setIsWaiting(false)
        }
    }, [props.appointment, issubstituted]);

    const handleMouseEnter = () => {
        if (hoverTimeout.current !== null) {
            clearTimeout(hoverTimeout.current);
        }
        hoverTimeout.current = window.setTimeout(() => {
            setIsHovered(true);
        }, 500);
    };

    const handleMouseLeave = () => {
        if (hoverTimeout.current !== null) {
            clearTimeout(hoverTimeout.current);
        }
        hoverTimeout.current = window.setTimeout(() => {
            setIsHovered(false);
        }, 5000);

    };

    function crossed(): string {
        if (iscancelled) {
            return "line-through";
        }
        return "none";
    }

    function cancelledcolor() {
        if (iswaiting) {
            return "#fc6464";
        } else if (iscancelled) {
            return "#fc6464";
        } else if (props.appointment?.getPresentators()?.find(pres => pres.getIsSubstituted() === true)) {
            return "#fc9764";
        } else {
            if (localStorage.getItem("theme") === "dark") {
                return `${dark_text}`;
            } else {
                return `${light_text}`;
            }
        }
    }

    function substituted(id: string): string {
        let pres = props.appointment?.getPresentators()?.find(pres => pres.getId() === id);
        if (pres?.getIsSubstituted()) {
            return "line-through";
        } else {
            return "none";
        }
    }

    const handleshowpopover = (event: React.MouseEvent<HTMLDivElement>) => {
        // console.log(props.appointment)
        let x = event.clientX - 70;
        let y = event.clientY + 10;
        let popoverHeight;
        props.type === "main" ? popoverHeight = 300 : popoverHeight = 600;
        const screenHeight = window.innerHeight;
        if (y + popoverHeight > screenHeight) {
            y = screenHeight - popoverHeight - 10;
        }
        setPosition({ x, y });
        setPopover(true);
    }

    const handleClosePopover = () => {
        setPopover(false);
    };


    const handlesubstitution = async () => {
        var checkbox = document.getElementById(`checkbox-${props.appointment?.getId()}`) as HTMLInputElement;
        console.log(checkbox);
        let origin = JSON.parse(props.appointment.getOrigin()!);
        if (checkbox!.checked) {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${props.appointment.getInstitutionId()}/${origin.type}/${origin.id}/appointments/${props.appointment.getId()}/presentators/${localStorage.getItem("presentatorid")}/substitute`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    isSubstituted: true,
                }),
            });
            if (!response.ok) {
                console.log(response);
            } else {
                console.log(response);
                setIsSubstituted(true);
                checkbox.checked = false;
                props.appointment?.getPresentators()?.find(pres => pres.getId() === localStorage.getItem("presentatorid"))?.setIsSubstituted(true);
                document.getElementById(`${localStorage.getItem("presentatorid")}`)?.setAttribute("style", "text-decoration: line-through;");
                setUpdate(prev => !prev);
            }
        } else {
            const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${props.appointment.getInstitutionId()}/${origin.type}/${origin.id}/appointments/${props.appointment.getId()}/presentators/${localStorage.getItem("presentatorid")}/substitute`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    isSubstituted: false,
                }),
            });
            if (!response.ok) {
                console.log(response);
            } else {
                console.log(response);
                setIsSubstituted(false);
                checkbox.checked = true;
                props.appointment?.getPresentators()?.find(pres => pres.getId() === localStorage.getItem("presentatorid"))?.setIsSubstituted(false);
                document.getElementById(`${localStorage.getItem("presentatorid")}`)?.setAttribute("style", "text-decoration: none;");
                setUpdate(prev => !prev);
            }
        }
    }

    const cancelAppointment = async () => {
        let origin = JSON.parse(props.appointment.getOrigin()!);
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/${props.appointment.getInstitutionId()}/${origin.type}/${origin.id}/appointments/${props.appointment.getId()}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                isCancelled: true,
            }),
        });
        if (!response.ok) {
            console.log(response);
        } else {
            console.log(response);
            setIscancelled(true);
            setIsWaiting(false);
            setUpdate(prev => !prev);
        }
    }

    return (
        <div title={`${props.appointment?.getSubject()?.getName()} - ${getTimeWithZeros(props.appointment?.getStart())} - ${getTimeWithZeros(props.appointment?.getEnd())}`} className={`class-card ${isHovered ? "expanded" : ""}`} onDoubleClick={handleshowpopover} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
            <h3 style={{ color: `${cancelledcolor()}`, textDecoration: `${crossed()}` }}><b>{props.appointment?.getSubject()?.getName()}</b></h3>
            <div className="class-container" style={{ color: `${cancelledcolor()}`, textDecoration: `${crossed()}` }}>
                <p className="rooms">{props.appointment.getRooms()!.map(room => room.getName()).join(" - ")} - {getTimeWithZeros(props.appointment?.getStart())} - {getTimeWithZeros(props.appointment?.getEnd())}</p>
                <>
                    <div className="extra-content">
                        {props.appointment?.getPresentators()?.map((pres, index) => (
                            <p key={index} id={pres.getId()} style={{ textDecoration: `${substituted(pres.getId())}` }}>{pres.getName()}</p>
                        ))}
                        {iswaiting ? <p style={{ color: `${cancelledcolor()}` }}><b>Substitution in progress...</b></p> : null}
                        {iscancelled ? <p style={{ color: `${cancelledcolor()}` }}><b>Cancelled!</b></p> : null}
                    </div>
                    {
                        ispresentatorsappointment && ispart ? (
                            <CostumCheckbox where="top" id={`checkbox-${props.appointment?.getId()}`} checked={issubstituted} onChange={handlesubstitution} labelText="Substitute? " />
                        ) : null
                    }
                    {
                        props.type == 'manage' && isdirector && iswaiting ? (
                            <CostumCheckbox where="top" onChange={cancelAppointment} checked={iscancelled} labelText="Cancel the appointment? " />
                        ) : null
                    }
                    {
                        props.type == 'manage' && isdirector && iscancelled ? (
                            <CostumCheckbox where="top" onChange={cancelAppointment} checked={iscancelled} labelText="Uncancel? " style={{ textDecoration: "none" }} />
                        ) : null
                    }
                </>
            </div>
            {
                props.type == "main" ?
                    <>
                        {showpopover &&
                            <>
                                {ReactDOM.createPortal(
                                    <AppointmentPopOver
                                        appointment={props.appointment}
                                        presentatorlist={props.presentatorlist}
                                        roomlist={props.roomlist}
                                        subjectlist={props.subjectlist}
                                        show={showpopover}
                                        type={"main"}
                                        x={position.x}
                                        y={position.y}
                                        onClose={handleClosePopover}
                                    />,
                                    document.getElementById("sidebar_2")!
                                )}
                            </>}
                    </>
                    : null
            }
            {
                props.type == "manage" ?
                    <>
                        {showpopover &&
                            <>
                                {ReactDOM.createPortal(
                                    <AppointmentPopOver
                                        appointment={props.appointment}
                                        presentatorlist={props.presentatorlist}
                                        roomlist={props.roomlist}
                                        subjectlist={props.subjectlist}
                                        show={showpopover}
                                        type={"manage"}
                                        x={position.x}
                                        y={position.y}
                                        onClose={handleClosePopover}
                                    />,
                                    document.getElementById("manage_sidebar_2")!
                                )}
                            </>}
                    </>
                    : null
            }
            {showpopover && ispresentatorsappointment && ispart ?
                <>
                    {ReactDOM.createPortal(
                        <AppointmentPopOver
                            appointment={props.appointment}
                            presentatorlist={props.presentatorlist}
                            roomlist={props.roomlist}
                            subjectlist={props.subjectlist}
                            show={showpopover}
                            type={"presentator"}
                            x={position.x}
                            y={position.y}
                            onClose={handleClosePopover}
                        />,
                        document.getElementById("sidebar_2")!
                    )}
                </>
                : null}
        </div>
    )
}