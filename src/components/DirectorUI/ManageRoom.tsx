import { useState } from "react";
import { Institutions } from "../../shared/classes/institutions";
import { Rooms } from "../../shared/classes/rooms";

interface Props {
    institution: Institutions;
    action: "add" | "update";
}

export function ManageRoom(props: Props) {
    const [roomname, setRoomname] = useState<string>("");
    const [room, setRoom] = useState<Rooms | null>(null);
    const [error, setError] = useState<string>("");
    let token = localStorage.getItem('token');

    const handlechangeroom = async () => {
        let change = 'POST';
        let url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/rooms`
        if (props.action === "update") {
            change = 'PATCH';
            url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/rooms/${room?.getId()}`
        }
        if (roomname === "") {
            setError("Please fill in all fields");
        } else {
            const response = await fetch(url, {
                method: change,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ name: roomname }),
            });
            if (!response.ok) {
                const data = await response.json();
                setError(data.message);
            }
            else {
                console.log(response);
                setError("Room added successfully");
                setRoomname("");
            }
        }
    }

    const handleRoomDelete = async () => {
        const url = `${import.meta.env.VITE_BASE_URL}/${props.institution.getId()}/rooms/${room?.getId()}`
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        });
        if (!response.ok) {
            const data = await response.json();
            setError(data.message);
        }
        else {
            console.log(response);
            setError("Room deleted successfully");
            setRoomname("");
        }
    }

    const handleroomchange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const room = props.institution.getRooms()?.find((rm: Rooms) => rm.getId() === e.target.value);
        setRoomname(room!.getName());
        setRoom(room!);
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
                        <label>Room Name: </label><br />
                        <input placeholder="Name:" type="text" value={roomname} onChange={(e) => setRoomname(e.target.value)} /><br />
                    </> : <>
                        <label>Room Name: </label><br />
                        <input placeholder="Name:" type="text" value={roomname} onChange={(e) => setRoomname(e.target.value)} /><br />
                    </>
                }
                <p id="errors">{error}</p>
                <div className="button-container">
                    <button onClick={handlechangeroom}>{props.action === "update" ? "Save" : "Create New "} Room</button>
                    {props.action === "update" && <button onClick={handleRoomDelete}>Delete Event</button>}
                </div>
            </div>
        </div>
    )
}