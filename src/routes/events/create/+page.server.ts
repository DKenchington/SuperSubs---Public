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
    const locationData = await prisma.accounts.findUnique({
        where: { accountID: parseInt(sessionID) },
        select: {
            location: true,
            address: true,
        },
    });
    const key = API_KEY
    //Sets the value of private environment variable API_KEY to the object property key 
    return { key, ...locationData}
    //Returns data from the load function, making it accessible from the svelte page component
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ cookies, request }) => {
        //The default function called upon submission of form data
        let formData: any = {};
        (await request.formData()).forEach(
            (value, key) => (formData[key] = value)
        );
        //Binds data from the form submission request to the formData object
        let sessionID = ensureAuthenticated(cookies)
        //Gets sessionID which corresponds to accountID
        await prisma.accounts.update({
            where: {
                accountID: parseInt(sessionID),
            },
            data: {
                events: {
                    create: {
                        title: formData.title,
                        description: formData.description,
                        sport: formData.sport,
                        ability: parseInt(formData.ability),
                        startDateTime: Date.parse(
                            formData.startDateTime
                        ).toString(),
                        endDateTime: Date.parse(
                            formData.endDateTime
                        ).toString(),
                        location: formData.location,
                        address: formData.address,
                        duration: parseInt(Date.parse(formData.endDateTime) - Date.parse(formData.startDateTime)),
                    },
                },
            },
        });
        //Creates new event in the database using the data submitted in the HTML form
        throw redirect(307, "/events");
        //Redirect the user to the account management page
    },
} satisfies Actions;
