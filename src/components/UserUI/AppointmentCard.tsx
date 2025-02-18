import { useEffect, useRef, useState } from "react";
import { Appointments } from "../../shared/classes/appointments"
import { Presentators } from "../../shared/classes/presentators";

interface Props {
    appointment: Appointments;
    presentatorlist: Presentators[];
}

export function AppointmentCard(props: Props) {
    const [showedit, setShowedit] = useState(false);
    const [iscancelled, setIscancelled] = useState(false);
    const [iswaiting, setIsWaiting] = useState(props.appointment.getIsCancelled());
    const [issubstituted, setIsSubstituted] = useState(props.appointment.getPresentators()?.find(pres => pres.getId() === localStorage.getItem("presentatorid"))?.getIsSubstituted()!);
    const [ispresentatorsappointment, setIsPresentatorsAppointment] = useState(false);
    const [ispart, setIsPart] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimeout = useRef<number | null>(null);
    const rootStyles = getComputedStyle(document.documentElement);
    const dark_text = rootStyles.getPropertyValue("--dark-text");
    const light_text = rootStyles.getPropertyValue("---light-text");

    const handleMouseEnter = () => {
        hoverTimeout.current = window.setTimeout(() => {
            setIsHovered(true);
        }, 500);
    };

    const handleMouseLeave = () => {
        if (hoverTimeout.current !== null) {
            clearTimeout(hoverTimeout.current);
        }
        setIsHovered(false);
    };

    useEffect(() => {
        let ins = JSON.parse(localStorage.getItem("institutions")!);
        if (ins) {
            for (let i = 0; i < ins.length; i++) {
                if (ins[i].id === props.appointment.getInstitutionId()) {
                    setIsPart(true);
                }
            }
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
    }, [props.appointment, issubstituted]);

    function getallrooms(): string {
        const rooms = props.appointment.getRooms();
        if (!rooms || rooms.length === 0) {
            return "";
        }
        return rooms.map(room => room.getName()).join(" ");
    }

    // function getallpres(): string {
    //     let presentators = '';
    //     if (props.appointment.getPresentators()) {
    //         presentators += props.appointment.getPresentators()?.map(pres => pres.getName()).join(" - ");
    //     }
    //     if (!presentators || presentators.length === 0) {
    //         return "";
    //     }
    //     return presentators;
    // }

    function getzero(time: Date): string {
        return `${("0" + time.getHours()).slice(-2)}:${("0" + time.getMinutes()).slice(-2)}`
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
        }
        if (props.appointment.getPresentators()?.find(pres => pres.getIsSubstituted() === true)) {
            return "#fc9764";
        }
        if (localStorage.getItem("theme") === "dark") {
            return `${dark_text}`;
        } else {
            return `${light_text}`;
        }
    }

    const handlecheckboxshow = () => {
        if (localStorage.getItem("role") === "PRESENTATOR" || localStorage.getItem("role") === "DIRECTOR" && props.appointment.getPresentators()?.find(pres => pres.getId() === localStorage.getItem("presentatorid"))) {
            setIsPresentatorsAppointment(true);
        }
        setShowedit(!showedit);
    }

    const handlesubstitution = () => {
        var checkbox = document.getElementById(`checkbox-${props.appointment.getId()}`) as HTMLInputElement;
        if (checkbox.checked) {
            checkbox.checked = false;
            console.log(props.appointment.getPresentators()?.find(pres => pres.getId() === localStorage.getItem("presentatorid"))?.getIsSubstituted())
            props.appointment.getPresentators()?.find(pres => pres.getId() === localStorage.getItem("presentatorid"))?.setIsSubstituted(true);
            document.getElementById(`${localStorage.getItem("presentatorid")}`)?.setAttribute("style", "text-decoration: line-through;");
            setIsSubstituted(true);
        } else {
            checkbox.checked = true;
            console.log(props.appointment.getPresentators()?.find(pres => pres.getId() === localStorage.getItem("presentatorid"))?.getIsSubstituted())
            props.appointment.getPresentators()?.find(pres => pres.getId() === localStorage.getItem("presentatorid"))?.setIsSubstituted(false);
            document.getElementById(`${localStorage.getItem("presentatorid")}`)?.setAttribute("style", "text-decoration: none;");
            setIsSubstituted(false);
            //Date ${props.appointment.getStart().getMonth()}.${props.appointment.getStart().getDate()}. - ${props.appointment.getEnd().getMonth()}.${props.appointment.getEnd().getDate()}.
        }
    }

    function substituted(id: string): string {
        let pres = props.appointment.getPresentators()?.find(pres => pres.getId() === id);
        if (pres?.getIsSubstituted()) {
            return "line-through";
        } else {
            return "none";
        }
    }

    return (
        <div className={`class-card ${isHovered ? "expanded" : ""} ${props.appointment.getStart().getDay() == 1 ? "monday" : ""} ${props.appointment.getStart().getDay() == 5 ? "friday" : ""}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onDoubleClick={handlecheckboxshow}>
            <h3 style={{ color: `${cancelledcolor()}`, textDecoration: `${crossed()}` }}><b>{props.appointment.getSubject()?.getName()}</b></h3>
            <div className="class-container" style={{ color: `${cancelledcolor()}`, textDecoration: `${crossed()}` }}>
                <p className="rooms">{getallrooms()} - {getzero(props.appointment.getStart())} - {getzero(props.appointment.getEnd())}</p>
                <div className="extra-content">
                    {props.appointment.getPresentators()?.map((pres) => (
                        <p key={pres.getId()} id={pres.getId()} style={{ textDecoration: `${substituted(pres.getId())}` }}>{pres.getName()}</p>
                    ))}
                    {iswaiting ? <p style={{ color: `${cancelledcolor()}` }}><b>Substitution in progress...</b></p> : null}
                    {iscancelled ? <p style={{ color: `${cancelledcolor()}` }}><b>Cancelled!</b></p> : null}
                </div>
            </div>
            {
                ispresentatorsappointment && ispart && showedit ? (
                    <>
                        <label>Cancelled? </label>
                        <input id={`checkbox-${props.appointment.getId()}`} onChange={handlesubstitution} checked={issubstituted} type="checkbox" />
                    </>
                ) : null
            }
        </div>
    )
}