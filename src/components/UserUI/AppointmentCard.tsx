import { useEffect, useRef, useState } from "react";
import { Appointments } from "../../shared/classes/appointments"
import { Presentators } from "../../shared/classes/presentators";
import { AppointmentPopOver } from "../DirectorUI/AppointmentPopOver";
import ReactDOM from "react-dom";

interface Props {
    appointment: Appointments;
    presentatorlist: Presentators[];
    type: "main" | "manage";
}

export function AppointmentCard(props: Props) {
    const [showedit, setShowedit] = useState(false);
    const [showpopover, setPopover] = useState(false);
    const [manage, setManage] = useState(false);
    const [iscancelled, setIscancelled] = useState(false);
    const [iswaiting, setIsWaiting] = useState(props.appointment?.getIsCancelled() || false);
    const [issubstituted, setIsSubstituted] = useState(props.appointment?.getPresentators()?.find(pres => pres.getId() === localStorage.getItem("presentatorid"))?.getIsSubstituted()! || false);
    const [issubstituteddirector, setIsSubstitutedDirector] = useState(false);
    const [ispresentatorsappointment, setIsPresentatorsAppointment] = useState(false);
    const [isdirector, setIsDirector] = useState(false);
    const [ispart, setIsPart] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const hoverTimeout = useRef<number | null>(null);
    const [presentators, setPresentators] = useState(
        props.appointment?.getPresentators()?.map((pres) => ({
            id: pres.getId(),
            name: pres.getName(),
            isSubstituted: pres.getIsSubstituted(),
        })) || []
    );

    useEffect(() => {
        if (props.type == "manage") {
            setManage(true);
        }
        let ins = JSON.parse(localStorage.getItem("institutions")!);
        if (ins) {
            for (let i = 0; i < ins.length; i++) {
                if (ins[i].id === props.appointment?.getInstitutionId()) {
                    setIsPart(true);
                    localStorage.setItem("role", ins[i].role);
                    console.log(ins[i].role)
                    localStorage.setItem("presentatorid", ins[i].presentatorid);
                }
            }
        }
        if (localStorage.getItem("role") === "DIRECTOR") {
            setIsDirector(true);
        }
        if (localStorage.getItem("role") === "PRESENTATOR" && props.appointment?.getPresentators()?.find(pres => pres.getId() === localStorage.getItem("presentatorid"))) {
            setIsPresentatorsAppointment(true);
        }
        if (props.appointment) {
            setPresentators(
                props.appointment.getPresentators()?.map((pres) => ({
                    id: pres.getId(),
                    name: pres.getName(),
                    isSubstituted: pres.getIsSubstituted(),
                })) || []
            );
        }
        let numberofpresentators = 0;
        for (let i = 0; i < presentators!.length; i++) {
            if (presentators![i].isSubstituted === true) {
                numberofpresentators++;
            }
        }
        if (numberofpresentators === presentators!.length) {
            setIsWaiting(true);
        } else {
            setIsWaiting(false);
        }
    }, [props.appointment, issubstituted, issubstituteddirector]);

    // useEffect(() => {
    //     if (showpopover) {
    //         const popoverElement = document.getElementById("manage_sidebar_2");
    //         if (popoverElement) {
    //             console.log("asd")
    //             ReactDOM.createPortal(
    //                 <AppointmentPopOver
    //                     appointment={props.appointment}
    //                     presentatorlist={props.presentatorlist}
    //                     show={showpopover}
    //                 />,
    //                 popoverElement
    //             );
    //         }
    //     }
    // }, [showpopover]);

    function getallrooms(): string {
        const rooms = props.appointment?.getRooms();
        if (!rooms || rooms.length === 0) {
            return "";
        }
        return rooms.map(room => room.getName()).join(" ");
    }

    function getzero(time: Date): string {
        return `${("0" + time?.getHours()).slice(-2)}:${("0" + time?.getMinutes()).slice(-2)}`
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
        if (props.appointment?.getPresentators()?.find(pres => pres.getIsSubstituted() === true)) {
            return "#fc9764";
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

    const handleshowedit = () => {
        setShowedit(!showedit);
    }

    const handleshowpopover = () => {

        setPopover((prev) => !prev);
    }

    const handlesubstitution = () => {
        var checkbox = document.getElementById(`checkbox-${props.appointment?.getId()}`) as HTMLInputElement;
        if (checkbox.checked) {
            setIsSubstituted(true);
            checkbox.checked = false;
            props.appointment?.getPresentators()?.find(pres => pres.getId() === localStorage.getItem("presentatorid"))?.setIsSubstituted(true);
            document.getElementById(`${localStorage.getItem("presentatorid")}`)?.setAttribute("style", "text-decoration: line-through;");
        } else {
            setIsSubstituted(false);
            checkbox.checked = true;
            props.appointment?.getPresentators()?.find(pres => pres.getId() === localStorage.getItem("presentatorid"))?.setIsSubstituted(false);
            document.getElementById(`${localStorage.getItem("presentatorid")}`)?.setAttribute("style", "text-decoration: none;");
        }
    }

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

    return (
        <div title={`${props.appointment?.getSubject()?.getName()} - ${getzero(props.appointment?.getStart())} - ${getzero(props.appointment?.getEnd())}`} className={`class-card ${isHovered ? "expanded" : ""}`} onMouseEnter={manage ? undefined : handleMouseEnter} onMouseLeave={manage ? undefined : handleMouseLeave} onClick={handleshowpopover} onDoubleClick={handleshowedit}>
            <h3 style={{ color: `${cancelledcolor()}`, textDecoration: `${crossed()}` }}><b>{props.appointment?.getSubject()?.getName()}</b></h3>
            <div className="class-container" style={{ color: `${cancelledcolor()}`, textDecoration: `${crossed()}` }}>
                <p className="rooms">{getallrooms()} - {getzero(props.appointment?.getStart())} - {getzero(props.appointment?.getEnd())}</p>
                {isdirector && showedit ? (
                    <>
                        {
                            presentators.map((pres) => (
                                <>
                                    <p key={pres.id} id={`${pres.id}-${props.appointment.getId()}`} style={{ textDecoration: `${substituted(pres.id)}` }}>{pres.name}</p>
                                </>
                            ))
                        }
                        {iswaiting ? <p style={{ color: `${cancelledcolor()}` }}><b>Substitution in progress...</b></p> : null}
                        {iscancelled ? <p style={{ color: `${cancelledcolor()}` }}><b>Cancelled!</b></p> : null}

                    </>
                ) : (
                    <>
                        <div className="extra-content">
                            {props.appointment?.getPresentators()?.map((pres, index) => (
                                <p key={index} id={pres.getId()} style={{ textDecoration: `${substituted(pres.getId())}` }}>{pres.getName()}</p>
                            ))}
                            {iswaiting ? <p style={{ color: `${cancelledcolor()}` }}><b>Substitution in progress...</b></p> : null}
                            {iscancelled ? <p style={{ color: `${cancelledcolor()}` }}><b>Cancelled!</b></p> : null}
                        </div>
                        {
                            ispresentatorsappointment && ispart && showedit ? (
                                <>
                                    <label>Cancelled? </label>
                                    <input id={`checkbox-${props.appointment?.getId()}`} onChange={handlesubstitution} checked={issubstituted} type="checkbox" />
                                </>
                            ) : null
                        }
                    </>
                )}
            </div>
            {showpopover && manage ?
                <>
                    {ReactDOM.createPortal(
                        <AppointmentPopOver
                            appointment={props.appointment}
                            presentatorlist={props.presentatorlist}
                            show={showpopover}
                        />,
                        document.getElementById("manage_sidebar_2")!
                    )}
                </> : null}
        </div>
    )
}