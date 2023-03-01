import { redirect } from "@sveltejs/kit";

export function ensureAuthenticated(cookies: any) {
    const sessionID = cookies.get("sessionID");
    if (sessionID == undefined) throw redirect(307, "/account/login");
    return sessionID;
}
//This checks sessionID cookie is defined, and redirects the user to log in if not

export function formatDate(date: number) {
    const ISODate = new Date(date);
    return (
        ISODate.getFullYear().toString() +
        "-" +
        (ISODate.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        ISODate.getDate().toString().padStart(2, "0") +
        "T" +
        ISODate.getHours().toString().padStart(2, "0") +
        ":" +
        ISODate.getMinutes().toString().padStart(2, "0")
    );
}
//This gets takes an ISO date (seconds from midnight January 1 1970) and returns it in a form that can be displayed by HTML datetime-local type inputs

export const sports = [
    "Football",
    "Cricket",
    "Hockey",
    "Tennis",
    "Volleyball",
    "Table Tennis",
    "Baseball",
    "Badminton",
    "Squash",
    "Basketball",
    "Rugby",
    "Handball",
];
//The list of sports supported by the website

export let abilities = {
    1: "Beginner",
    2: "Casual",
    3: "Experienced",
    4: "Semi-professional",
    5: "Professional",
};
//The ability levels defined by the website

export function findDistance(eventCoords: string, homeCoords: string) {
    const lat1 = parseInt(eventCoords.split(",")[0]);
    const lon1 = parseInt(eventCoords.split(",")[1]);
    const lat2 = parseInt(homeCoords.split(",")[0]);
    const lon2 = parseInt(homeCoords.split(",")[1]);
    let distance =
        Math.acos(
            Math.sin(lat1) * Math.sin(lat2) +
                Math.cos(lat1) * Math.cos(lat2) * Math.cos(lon2 - lon1)
        ) * 6371;
    return distance;
}
