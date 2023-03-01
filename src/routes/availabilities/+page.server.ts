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
    let availabilities = await prisma.availabilities.findMany({
        where: {
            accountID: parseInt(sessionID),
        },
        select: {
            availabilityID: true,
            sport: true,
            ability: true,
            startDateTime: true,
            endDateTime: true,
            location: true,
            address: true,
        },
    })
    let key = API_KEY
    return { availabilities, key };
}) satisfies PageServerLoad;

export const actions = {
    update: async ({ cookies, request }) => {
        const sessionID = ensureAuthenticated(cookies);
        let data: any = {};
        (await request.formData()).forEach((value, key) => (data[key] = value));
        await prisma.availabilities.update({
            where: {
                availabilityID: parseInt(data.availabilityID),
            },
            data: {
                ...data,
                availabilityID: undefined,
                ability: parseInt(data.ability),
                startDateTime: Date.parse(data.startDateTime).toString(),
                endDateTime: Date.parse(data.endDateTime).toString(),
            }
        })
    },
    //Updates the availability with the form data, then overides certain fields which need to be modified
    delete: async ({ cookies, request }) => {
        let data: any = {};
        (await request.formData()).forEach((value, key) => (data[key] = value));
        const sessionID = ensureAuthenticated(cookies);
        await prisma.availabilities.delete({
            where: {
                availabilityID: parseInt(data.availabilityID),
            },
        });
    },
    //Deletes an availability by eventID
} satisfies Actions;
