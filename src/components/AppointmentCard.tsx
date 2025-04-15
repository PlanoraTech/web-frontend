import { useEffect, useRef, useState } from "react";
import { Appointments } from "../shared/classes/appointments"
import { Presentators } from "../shared/classes/presentators";
import { PopOver } from "./PopOver";
import ReactDOM from "react-dom";
import { getTimeWithZeros } from "../functions/getTimeWithZeros";
import { Subjects } from "../shared/classes/subjects";
import { Rooms } from "../shared/classes/rooms";
import { CostumCheckbox } from "./CostumCheckbox";
import { getBearerToken } from "../functions/utils";

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
    const popoverType = getPopoverType();
    const rootStyles = getComputedStyle(document.documentElement);
    const dark_text = rootStyles.getPropertyValue("--dark-text");
    const light_text = rootStyles.getPropertyValue("---light-text");

    useEffect(() => {
        setRole();
        if (getRole() === "DIRECTOR") {
            setIsDirector(true);
        }
        if (getRole() === "PRESENTATOR" && props.appointment?.getPresentators()?.find(pres => pres.getId() === localStorage.getItem("presentatorid"))) {
            setIsPresentatorsAppointment(true);
        }
        waiting();
        if (iscancelled == true) {
            setIsWaiting(false)
        }
    }, [props.appointment, issubstituted]);

    const handlesubstitution = async () => {
        if (props.appointment?.getStart()! < new Date()) {
            alert("You cannot substitute a past appointment!");
        } else {
            var checkbox = document.getElementById(`checkbox-${props.appointment?.getId()}`) as HTMLInputElement;
            let origin = JSON.parse(props.appointment.getOrigin()!);
            if (checkbox!.checked) {
                if (await patchAppointment(`${import.meta.env.VITE_BASE_URL}/${props.appointment.getInstitutionId()}/${origin.type}/${origin.id}/appointments/${props.appointment.getId()}/presentators/${localStorage.getItem("presentatorid")}/substitute`, { isSubstituted: true })) {
                    setIsSubstituted(true);
                    checkbox.checked = false;
                    props.appointment?.getPresentators()?.find(pres => pres.getId() === localStorage.getItem("presentatorid"))?.setIsSubstituted(true);
                    document.getElementById(`${localStorage.getItem("presentatorid")}`)?.setAttribute("style", "text-decoration: line-through;");
                    setUpdate(prev => !prev);
                }
            } else {
                if (await patchAppointment(`${import.meta.env.VITE_BASE_URL}/${props.appointment.getInstitutionId()}/${origin.type}/${origin.id}/appointments/${props.appointment.getId()}/presentators/${localStorage.getItem("presentatorid")}/substitute`, { isSubstituted: false })) {
                    setIsSubstituted(false);
                    checkbox.checked = true;
                    props.appointment?.getPresentators()?.find(pres => pres.getId() === localStorage.getItem("presentatorid"))?.setIsSubstituted(false);
                    document.getElementById(`${localStorage.getItem("presentatorid")}`)?.setAttribute("style", "text-decoration: none;");
                    setUpdate(prev => !prev);
                }
            }
        }
    }

    const cancelAppointment = async () => {
        var checkbox = document.getElementById(`checkboxcancel-${props.appointment?.getId()}`) as HTMLInputElement;
        let origin = JSON.parse(props.appointment.getOrigin()!);
        if (checkbox!.checked) {
            if (await patchAppointment(`${import.meta.env.VITE_BASE_URL}/${props.appointment.getInstitutionId()}/${origin.type}/${origin.id}/appointments/${props.appointment.getId()}`, { isCancelled: true })) {
                checkbox!.checked = false;
                setIscancelled(true);
                setIsWaiting(false);
                setUpdate(prev => !prev);
            }
        } else {
            if (await patchAppointment(`${import.meta.env.VITE_BASE_URL}/${props.appointment.getInstitutionId()}/${origin.type}/${origin.id}/appointments/${props.appointment.getId()}`, { isCancelled: false })) {
                checkbox!.checked = true;
                setIscancelled(false);
                setIsWaiting(true);
                setUpdate(prev => !prev);

            }
        }
    }

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

    const handleshowpopover = (event: React.MouseEvent<HTMLDivElement>) => {
        let x = event.clientX - 70;
        let y = event.clientY + 10;
        const popoverHeight = props.type === "main" ? 300 : 600;
        const popoverWidth = props.type === "main" ? 0 : 500;
        const position = calculatePopoverPosition(x, y, popoverHeight, popoverWidth);
        setPosition(position);
        setPopover(true);
    }

    const handleClosePopover = () => {
        setPopover(false);
    };

    function setRole() {
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
    }

    function getRole(): string {
        if (localStorage.getItem("role") === "DIRECTOR") {
            return "DIRECTOR";
        } else if (localStorage.getItem("role") === "PRESENTATOR") {
            return "PRESENTATOR";
        } else {
            return "USER";
        }
    }

    function waiting() {
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
        setUpdate(prev => !prev);
    }

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

    function calculatePopoverPosition(x: number, y: number, popoverHeight: number, popoverWidth: number) {
        const screenHeight = window.innerHeight;
        const screenWidth = window.innerWidth;
        if (y + popoverHeight > screenHeight) {
            y = screenHeight - popoverHeight - 10;
        }
        if (x + popoverWidth > screenWidth) {
            x = screenWidth - popoverWidth - 10;
        }
        return { x, y };
    };

    async function patchAppointment(path: string, body: object) {
        const response = await fetch(path, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getBearerToken()}`
            },
            body: JSON.stringify(body),
        });
        if (!response.ok) {
            alert(await response.text());
            return false;
        }
        return true;
    }



    function getPopoverType(): "main" | "manage" | "presentator" | null {
        if (props.type === "manage" && isdirector) {
            return "manage";
        } else if (props.type === "main" && ispresentatorsappointment && ispart) {
            return "presentator";
        } else if (props.type === "main") {
            return "main";
        }
        return null;
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
                        ispresentatorsappointment && ispart && props.appointment.getStart() > new Date() ? (
                            <CostumCheckbox where="top" id={`checkbox-${props.appointment?.getId()}`} checked={issubstituted} onChange={handlesubstitution} labelText="Substitute? " />
                        ) : null
                    }
                    {
                        props.type == 'manage' && isdirector && iswaiting && props.appointment.getStart() > new Date() ? (
                            <CostumCheckbox where="top" id={`checkboxcancel-${props.appointment?.getId()}`} onChange={cancelAppointment} checked={iscancelled} labelText="Cancel the appointment? " />
                        ) : null
                    }
                    {
                        props.type == 'manage' && isdirector && iscancelled ? (
                            <div id="uncancel" style={{ textDecoration: "none" }}>
                                <CostumCheckbox where="top" id={`checkboxcancel-${props.appointment?.getId()}`} onChange={cancelAppointment} checked={iscancelled} labelText="Uncancel? " />
                            </div>
                        ) : null
                    }
                </>
            </div>
            {showpopover && popoverType !== null && (
                ReactDOM.createPortal(
                    <PopOver
                        appointment={props.appointment!}
                        presentatorlist={props.presentatorlist}
                        roomlist={props.roomlist}
                        subjectlist={props.subjectlist}
                        show={showpopover}
                        type={popoverType}
                        x={position.x}
                        y={position.y}
                        onClose={handleClosePopover}
                    />,
                    document.getElementById(
                        popoverType === "manage" ? "manage_sidebar_2" : "sidebar_2"
                    )!
                )
            )}
        </div>
    )
}