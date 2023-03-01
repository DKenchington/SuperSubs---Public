import { ensureAuthenticated } from "$lib/utils";
//Imports function which checks accountID is valid and redirects to the log in page if not
import type { Actions, PageServerLoad } from "./$types";
//Imports the const types used to load data to the page and handle form data 
import prisma from "$lib/client";
//Imports the prisma client used to access the database
import { redirect } from "@sveltejs/kit";
//Imports svelteKit's built in redirect function
import { API_KEY } from "$env/static/private";
//Imports the Google Maps API key from environment variables

export const load = (async ({ cookies }) => {
    const sessionID = ensureAuthenticated(cookies);
    //Ensures user is logged in
    const locationData = await prisma.accounts.findUnique({
        where: {accountID: parseInt(sessionID)},
        select: {
            location: true,
            address: true,
        },
    });
    //Returns the user's account location data so that fields in the create availability form can be autofilled
    let key: string = API_KEY
    //Sets the value of private environment variable API_KEY to the variable key
    return {key, ...locationData}
    //Returns 'key' from the load function, making it accessible from the svelte page component
}) satisfies PageServerLoad

export const actions = {
    default: async ({ cookies, request }) => {
        //The default function called upon submission of form data
        let data: any = {};
        (await request.formData()).forEach((value, key) => (data[key] = value));
        //Binds data from the form submission request to the data object
        let sessionID = ensureAuthenticated(cookies);
        //Gets sessionID which corresponds to accountID
        await prisma.accounts.update({
            where: {
                accountID: parseInt(sessionID),
            },
            data: {
                availabilities: {
                    create: {
                        location: data.location,
                        address: data.address,
                        distance: parseInt(data.distance),
                        sport: data.sport,
                        ability: parseInt(data.ability),
                        startDateTime: Date.parse(data.startDateTime).toString(),
                        endDateTime: Date.parse(data.endDateTime).toString(),
                    },
                },
            }
        });
        //Creates new availability in the database using the data submitted in the HTML form
        throw redirect(307, "/availabilities")
        //Redirect the user to the account management page
    }
} satisfies Actions;