import prisma from "../../lib/client";
//Prisma client used to query database
import type { PageServerLoad } from "./$types";
//SvelteKit type used to load data
import type { Actions } from "./$types";
//SvelteKit type used to handle form submission
import { API_KEY } from "$env/static/private";
//Api key environment variable
import { ensureAuthenticated } from "../../lib/utils";
//Function that redirects user to log in if sessionID is invalid or there is none

export const load = (async ({ cookies }) => {
    //Function that loads data to the page
    const sessionID = ensureAuthenticated(cookies);
    //Checks whether the user is signed in, redirects to log in page if not, and returns sessionID, which corresponds to accountID
    let events = await prisma.events.findMany({
        where: {
            accountID: parseInt(sessionID),
        },
        select: {
            eventID: true,
            title: true,
            description: true,
            sport: true,
            ability: true,
            startDateTime: true,
            endDateTime: true,
            location: true,
            address: true,
        },
    });
    let key = API_KEY;
    return { events, key };
}) satisfies PageServerLoad;

export const actions = {
    update: async ({ cookies, request }) => {
        let data: any = {};
        const sessionID = ensureAuthenticated(cookies);
        (await request.formData()).forEach((value: any, key: any) => (data[key] = value));
        await prisma.events.update({
            where: {
                eventID: parseInt(data.eventID),
            },
            data: {
                ...data,
                eventID: undefined,
                ability: parseInt(data.ability),
                startDateTime: Date.parse(data.startDateTime).toString(),
                endDateTime: Date.parse(data.endDateTime).toString(),
                duration: parseInt(Date.parse(data.endDateTime) - Date.parse(data.startDateTime)),
            },
        });
    },
    //Updates the event with the form data, then overides certain fields which need to be modified
    delete: async ({ cookies, request }) => {
        let data: any = {};
        (await request.formData()).forEach((value, key) => (data[key] = value));
        const sessionID = ensureAuthenticated(cookies);
        await prisma.events.delete({
            where: {
                eventID: parseInt(data.eventID),
            },
        });
    },
    //Deletes an event by eventID
} satisfies Actions;
