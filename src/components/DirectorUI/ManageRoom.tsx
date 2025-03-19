import { useEffect, useState } from "react";
import { Institutions } from "../../shared/classes/institutions";
import { Rooms } from "../../shared/classes/rooms";
import { getTokenUrl } from "../../functions/getTokenUrl";

interface Props {
    institution: Institutions;
    action: "add" | "update";
}

export function ManageRoom(props: Props) {
    const [roomname, setRoomname] = useState<string>("");
    const [room, setRoom] = useState<Rooms | null>(null);
    const [action, setAction] = useState<"add" | "update">("add");
    const [error, setError] = useState<string>("");


    useEffect(() => {
        if (props.action === "update") {
            setAction("update");
        }
    }, [room])

    const handlechangeroom = async () => {
        let change = 'POST';
        let url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/rooms/${getTokenUrl()}`
        if (action === "update") {
            change = 'PATCH';
            url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/rooms/${room?.getId()}/${getTokenUrl()}`
        }
        if (roomname === "") {
            setError("Please fill in all fields");
        } else {
            const response = await fetch(url, {
                method: change,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name: roomname }),
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            }
            else {
                console.log(response);
                setError("");
                setRoomname("");
            }
        }
    }

    const handleroomchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const room = props.institution.getRooms()?.find((rm: Rooms) => rm.getId() === e.target.value);
        setRoomname(room!.getName());
        setRoom(room!);
    }

    return (
        <div className="form-container">
            <h2>{action === "update" ? "Update" : "Add"} Room</h2>
            <div className="form-div">
                {
                    action === "update" ? <>
                        <select onChange={handleroomchange} value={room?.getId() || 'default'}>
                            <option value="default" disabled>Rooms</option>
                            {props.institution.getRooms()?.map((room) => (
                                <option key={room.getId()} value={room.getId()}>{room.getName()}</option>
                            ))}
                        </select><br />
                        <label>Room Name: </label><br />
                        <input placeholder="Name:" type="text" value={roomname} onChange={(e) => setRoomname(e.target.value)} /><br />
                    </> : <>
                        <label>Room Name: </label><br />
                        <input placeholder="Name:" type="text" value={roomname} onChange={(e) => setRoomname(e.target.value)} /><br />
                    </>
                }
                <p id="errors">{error}</p>
                <div className="button-container">
                    <button onClick={handlechangeroom}>{action === "update" ? "Save" : "Create New "} Room</button>
                </div>
            </div>
        </div>
    )
}