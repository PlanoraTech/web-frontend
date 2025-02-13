import { useEffect, useRef, useState } from "react";
import { Appointments } from "../../shared/classes/appointments"
import { Presentators } from "../../shared/classes/presentators";

interface Props {
    appointment: Appointments;
    presentatorlist: Presentators[];
}

export function AppointmentCard(props: Props) {
    const [showedit, setShowedit] = useState(false);
    const [iscancelled, setIscancelled] = useState(props.appointment.getIsCancelled());
    // const [differentpresentator, setDifferentPresentator] = useState(getallpres());
    const [ispresentator, setIsPresentator] = useState(false);
    const [ispart, setIsPart] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimeout = useRef<number | null>(null);
    const rootStyles = getComputedStyle(document.documentElement);
    const dark_text = rootStyles.getPropertyValue("--dark-text");
    const light_text = rootStyles.getPropertyValue("---light-text");

    const handleMouseEnter = () => {
        hoverTimeout.current = window.setTimeout(() => {
            setIsHovered(true);
        }, 1000);
    };

    const handleMouseLeave = () => {
        if (hoverTimeout.current !== null) {
            clearTimeout(hoverTimeout.current);
        }
        setIsHovered(false);
    };

    useEffect(() => {
        if (localStorage.getItem("role") === "PRESENTATOR") {
            setIsPresentator(true);
        }
        let ins = JSON.parse(localStorage.getItem("institutions")!);
        if (ins) {
            for (let i = 0; i < ins.length; i++) {
                if (ins[i].id === props.appointment.getInstitutionId()) {
                    setIsPart(true);
                }
            }
        }
    }, [props.appointment]);

    function getallrooms(): string {
        const rooms = props.appointment.getRooms();
        if (!rooms || rooms.length === 0) {
            return "";
        }
        return rooms.map(room => room.getName()).join(" ");
    }

    function getallpres(): string {
        let presentators = '';
        if (props.appointment.getPresentators()) {
            presentators += props.appointment.getPresentators()?.map(pres => pres.getName()).join(" - ");
        }
        if (!presentators || presentators.length === 0) {
            return "";
        }
        return presentators;
    }

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
        if (iscancelled) {
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
        setShowedit(!showedit);
        console.log(props.appointment.getPresentators());
        console.log(getallpres());
        console.log(props.appointment.getStart().getDay());
        console.log(props.appointment.getStart());
    }

    // const handleteacherchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    //     const presId = e.target.value;
    //     setDifferentPresentator(e.target.value);
    //     const presentator = props.presentatorlist?.find(p => p.getId() === presId) || null;
    //     if (presentator) {
    //         props.appointment.setPresentators([presentator]);
    //     }
    // }

    const handlecancel = () => {
        var checkbox = document.getElementById(`checkbox-${props.appointment.getId()}`) as HTMLInputElement;
        if (checkbox.checked) {
            checkbox.checked = false;
            props.appointment.setIsCancelled(true);
            setIscancelled(true);
        } else {
            checkbox.checked = true
            props.appointment.setIsCancelled(false);
            setIscancelled(false);
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
        <>
            {
                ispresentator && ispart ? (
                    <div className={`class-card ${isHovered ? "expanded" : ""}`} style={{ cursor: 'help' }} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onDoubleClick={handlecheckboxshow}>
                        <h3 style={{ color: `${cancelledcolor()}`, textDecoration: `${crossed()}` }}><b>{props.appointment.getSubject()?.getName()}</b></h3>
                        <div className="class-container" style={{ color: `${cancelledcolor()}`, textDecoration: `${crossed()}` }}>
                            <p className="rooms">{getallrooms()} - {getzero(props.appointment.getStart())} - {getzero(props.appointment.getEnd())}</p>
                            <div className="extra-content">{props.appointment.getPresentators()?.map((pres) => (
                                <p key={pres.getId()} style={{ textDecoration: `${substituted(pres.getId())}` }}>{pres.getName()}</p>
                            ))}</div>
                        </div>
                        {
                            showedit ?
                                <>
                                    <label>Cancelled? </label>
                                    <input id={`checkbox-${props.appointment.getId()}`} onChange={handlecancel} checked={iscancelled} type="checkbox" />
                                    {/* <select className="teacher-change" onChange={handleteacherchange} value={differentpresentator}>
                                        {
                                            props.presentatorlist!.map((pres, index) => (
                                                <option key={index} value={pres.getId()}>{pres.getName()}</option>
                                            ))
                                        }
                                    </select> */}
                                </> : null
                        }
                    </div>
                ) : (
                    <div className={`class-card ${isHovered ? "expanded" : ""}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onDoubleClick={handlecheckboxshow}>
                        <h3 style={{ color: `${cancelledcolor()}`, textDecoration: `${crossed()}` }}><b>{props.appointment.getSubject()?.getName()}</b></h3>
                        <div className="class-container" style={{ color: `${cancelledcolor()}`, textDecoration: `${crossed()}` }}>
                            <p className="rooms">{getallrooms()} - {getzero(props.appointment.getStart())} - {getzero(props.appointment.getEnd())}</p>
                            <div className="extra-content">{props.appointment.getPresentators()?.map((pres) => (
                                <p key={pres.getId()} style={{ textDecoration: `${substituted(pres.getId())}` }}>{pres.getName()}</p>
                            ))}</div>
                        </div>
                    </div>
                )
            }
        </>
    )
}