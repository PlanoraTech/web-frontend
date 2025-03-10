import { useEffect, useRef, useState } from "react";
import { Appointments } from "../../shared/classes/appointments"
import { Presentators } from "../../shared/classes/presentators";
import { AppointmentPopOver } from "../AppointmentPopOver";
import ReactDOM from "react-dom";
import { getTimeWithZeros } from "../../functions/getTimeWithZeros";

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
    const [ispresentatorsappointment, setIsPresentatorsAppointment] = useState(false);
    const [isdirector, setIsDirector] = useState(false);
    const [ispart, setIsPart] = useState(false);
    const [position, setPosition] = useState({ x: 0, y: 0 });

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
        const rooms = props.appointment?.getRooms();
        if (!rooms || rooms.length === 0) {
            return "";
        }
        return rooms.map(room => room.getName()).join(" ");
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
        console.log(showedit)
        setShowedit(!showedit);
    }

    const handleshowpopover = (event: React.MouseEvent<HTMLDivElement>) => {
        let x = event.clientX - 70; 
        let y = event.clientY + 10; 
        const popoverHeight = 250; 
        const screenHeight = window.innerHeight;
        if (y + popoverHeight > screenHeight) {
            y = screenHeight - popoverHeight - 10;
        }
        setPosition({ x, y });
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

    return (
        <div title={`${props.appointment?.getSubject()?.getName()} - ${getTimeWithZeros(props.appointment?.getStart())} - ${getTimeWithZeros(props.appointment?.getEnd())}`} className={`class-card`} onClick={handleshowedit} onDoubleClick={handleshowpopover}>
            <h3 style={{ color: `${cancelledcolor()}`, textDecoration: `${crossed()}` }}><b>{props.appointment?.getSubject()?.getName()}</b></h3>
            <div className="class-container" style={{ color: `${cancelledcolor()}`, textDecoration: `${crossed()}` }}>
                <p className="rooms">{getallrooms()} - {getTimeWithZeros(props.appointment?.getStart())} - {getTimeWithZeros(props.appointment?.getEnd())}</p>
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
            </div>
            {showpopover &&
                <>
                    {ReactDOM.createPortal(
                        <AppointmentPopOver
                            appointment={props.appointment}
                            presentatorlist={props.presentatorlist}
                            show={showpopover}
                            type={props.type}
                            x={position.x}
                            y={position.y}
                        />,
                        document.getElementById(`${props.type == "main" ? "sidebar_2" : "manage_sidebar_2"}`)!
                    )}
                </>}
        </div>
    )
}