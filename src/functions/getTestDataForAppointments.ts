import { Appointments } from "../shared/classes/appointments";
import { Presentators } from "../shared/classes/presentators";
import { Rooms } from "../shared/classes/rooms";
import { Subjects } from "../shared/classes/subjects";

export function getTestDataForAppointments() {
    let preslist: Presentators[] = [
        new Presentators("1", "TMSE", "asd"),
        new Presentators("1", "TMSE", "asd"),
    ];
    let roomlist: Rooms[] = [
        new Rooms("1", "A218", true, "asd"),
        // new Rooms("2", "A217", false, "asd"),
    ];
    let sub: Subjects = new Subjects("1", "Math", "math_0", "asd");

    let applist: Appointments[] = [
        new Appointments("01", sub, preslist, roomlist, new Date("2025-02-24T08:00:00"), new Date("2025-02-24T08:45:00"), false),
        new Appointments("02", sub, preslist, roomlist, new Date("2025-02-24T08:55:00"), new Date("2025-02-24T09:40:00"), false),
        new Appointments("03", sub, preslist, roomlist, new Date("2025-02-24T09:50:00"), new Date("2025-02-24T10:35:00"), false),
        new Appointments("04", sub, preslist, roomlist, new Date("2025-02-24T10:50:00"), new Date("2025-02-24T11:35:00"), false),
        new Appointments("05", sub, preslist, roomlist, new Date("2025-02-24T11:45:00"), new Date("2025-02-24T12:30:00"), false),
        new Appointments("06", sub, preslist, roomlist, new Date("2025-02-24T12:50:00"), new Date("2025-02-24T13:35:00"), false),
        new Appointments("07", sub, preslist, roomlist, new Date("2025-02-25T08:00:00"), new Date("2025-02-25T08:45:00"), false),
        new Appointments("08", sub, preslist, roomlist, new Date("2025-02-25T08:55:00"), new Date("2025-02-25T09:40:00"), false),
        new Appointments("09", sub, preslist, roomlist, new Date("2025-02-25T09:50:00"), new Date("2025-02-25T10:35:00"), false),
        new Appointments("10", sub, preslist, roomlist, new Date("2025-02-25T10:50:00"), new Date("2025-02-25T11:35:00"), false),
        new Appointments("11", sub, preslist, roomlist, new Date("2025-02-25T11:45:00"), new Date("2025-02-25T12:30:00"), false),
        new Appointments("12", sub, preslist, roomlist, new Date("2025-02-25T12:50:00"), new Date("2025-02-25T13:35:00"), false),
        new Appointments("13", sub, preslist, roomlist, new Date("2025-02-26T08:00:00"), new Date("2025-02-26T08:45:00"), false),
        new Appointments("14", sub, preslist, roomlist, new Date("2025-02-26T08:55:00"), new Date("2025-02-26T09:40:00"), false),
        new Appointments("15", sub, preslist, roomlist, new Date("2025-02-26T09:50:00"), new Date("2025-02-26T10:35:00"), false),
        new Appointments("16", sub, preslist, roomlist, new Date("2025-02-26T10:50:00"), new Date("2025-02-26T11:35:00"), false),
        new Appointments("17", sub, preslist, roomlist, new Date("2025-02-26T11:45:00"), new Date("2025-02-26T12:30:00"), false),
        new Appointments("18", sub, preslist, roomlist, new Date("2025-02-26T12:50:00"), new Date("2025-02-26T13:35:00"), false),
        new Appointments("19", sub, preslist, roomlist, new Date("2025-02-27T08:00:00"), new Date("2025-02-27T08:45:00"), false),
        new Appointments("20", sub, preslist, roomlist, new Date("2025-02-27T08:55:00"), new Date("2025-02-27T09:40:00"), false),
        new Appointments("21", sub, preslist, roomlist, new Date("2025-02-27T09:50:00"), new Date("2025-02-27T10:35:00"), false),
        new Appointments("22", sub, preslist, roomlist, new Date("2025-02-27T10:50:00"), new Date("2025-02-27T11:35:00"), false),
        new Appointments("23", sub, preslist, roomlist, new Date("2025-02-27T11:45:00"), new Date("2025-02-27T12:30:00"), false),
        new Appointments("24", sub, preslist, roomlist, new Date("2025-02-27T12:50:00"), new Date("2025-02-27T13:35:00"), false),
        new Appointments("25", sub, preslist, roomlist, new Date("2025-02-28T08:00:00"), new Date("2025-02-28T08:45:00"), false),
        new Appointments("26", sub, preslist, roomlist, new Date("2025-02-28T08:55:00"), new Date("2025-02-28T09:40:00"), false),
        new Appointments("27", sub, preslist, roomlist, new Date("2025-02-28T09:50:00"), new Date("2025-02-28T10:35:00"), false),
        new Appointments("28", sub, preslist, roomlist, new Date("2025-02-28T10:50:00"), new Date("2025-02-28T11:35:00"), false),
        new Appointments("29", sub, preslist, roomlist, new Date("2025-02-28T11:45:00"), new Date("2025-02-28T12:30:00"), false),
        new Appointments("30", sub, preslist, roomlist, new Date("2025-02-28T12:50:00"), new Date("2025-02-28T13:35:00"), false),
    ];

    return applist;
}