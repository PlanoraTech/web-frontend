import { useState } from "react";
import { Institutions } from "../../shared/classes/institutions";
import { Rooms } from "../../shared/classes/rooms";
import { getBearerToken } from "../../functions/utils";

interface Props {
    institution: Institutions;
    action: "add" | "update";
}

export function ManageRoom(props: Props) {
    const [roomname, setRoomname] = useState<string>("");
    const [room, setRoom] = useState<Rooms | null>(null);
    const [error, setError] = useState<string>("");
    const [success, setSuccess] = useState<string>("");

    const handlechangeroom = async () => {
        setError("");
        setSuccess("");
        let change = 'POST';
        let url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/rooms`
        if (props.action === "update") {
            change = 'PATCH';
            url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/rooms/${room?.getId()}`
        }
        if (roomname.trim() === "") {
            setError("Please fill in all fields");
            return;
        }
        if (roomname === room?.getName()) {
            setError("No changes made");
            return;
        }
        const response = await fetch(url, {
            method: change,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getBearerToken()}`
            },
            body: JSON.stringify({ name: roomname }),
        });
        if (!response.ok) {
            const data = await response.json();
            setError(data.message);
        }
        else {
            setSuccess("Room added successfully");
            setRoomname("");
            setRoom(null);
        }

    }

    const handleRoomDelete = async () => {
        setError("");
        setSuccess("");
        if (confirm("Are you sure you want to delete this room?")) {
            const url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/rooms/${room?.getId()}`
            const response = await fetch(url, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getBearerToken()}`
                },
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            }
            else {
                setSuccess("Room deleted successfully");
                setRoomname("");
                setRoom(null);
            }
        } else {
            setError("Room deletion cancelled");
        }
    }

    const handleroomchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selected = props.institution.getRooms()?.find((rm: Rooms) => rm.getId() === e.target.value);
        if (selected) {
            setRoomname(selected.getName());
            setRoom(selected);
            setSuccess("");
            setError("");
        }
    }

    return (
        <div className="form-container">
            <h2>{props.action === "update" ? "Update" : "Add"} Room</h2>
            <div className="form-div">
                {
                    props.action === "update" ? <>
                        <select onChange={handleroomchange} value={room?.getId() || 'default'}>
                            <option value="default" disabled>Rooms</option>
                            {props.institution.getRooms()?.map((room) => (
                                <option key={room.getId()} value={room.getId()}>{room.getName()}</option>
                            ))}
                        </select><br />
                        {room ? <>
                            <label>Room Name: </label><br />
                            <input placeholder="Name:" type="text" value={roomname} onChange={(e) => setRoomname(e.target.value)} /><br />
                        </> : null}
                    </> : <>
                        <label>Room Name: </label><br />
                        <input placeholder="Name:" type="text" value={roomname} onChange={(e) => setRoomname(e.target.value)} /><br />
                    </>
                }
                {error && <p id="errors">{error}</p>}
                {success && <p id="success">{success}</p>}
                <div className="button-container">
                    <button onClick={handlechangeroom}>{props.action === "update" ? "Save" : "Create New "} Room</button>
                    {props.action === "update" && <button onClick={handleRoomDelete}>Delete Room</button>}
                </div>
            </div>
        </div>
    )
}