import { API_KEY } from "$env/static/private";
import { ensureAuthenticated } from "$lib/utils";
//Imports the Google Maps API key from environment variables
import { error, fail, redirect } from "@sveltejs/kit";
//Imports svelteKit's built in error, fail, and redirect functions
import prisma from "../../../lib/client";
//Imports the prisma client used to access the database
import type { Actions, PageServerLoad } from "./$types";
//Imports the const types used to load data to the page and handle form data

export const actions = {
    default: async ({ cookies, request }) => {
        //The default function called upon submission of form data
        let data: any = {};
        (await request.formData()).forEach((value, key) => (data[key] = value));
        //Binds data from the form submission request to the data object
        try {
            await prisma.accounts.create({ data });
        } catch {
            return fail(400, data);
        }
        //Attemps to create a new database account entry using this data, returning a 400 fail if the operation fails
        let user = await prisma.accounts.findUnique({
            where: { email: data["email"] },
            select: { accountID: true },
        });
        //Gets the accountID of the new account created and sets it to the value of object user
        if (user == null) {
            throw error(500);
        }
        //If no data exists for the email used, throw a 500 error
        cookies.set("sessionID", user.accountID.toString(), { path: "/" });
        //Set a new cookie, accessible from anywhere, with the ID of the currently logged in user
        throw redirect(307, "/account");
        //Redirect the user to the account management page
    },
} satisfies Actions;

export const load = (async ({ cookies }) => {
    let key: string = API_KEY;
    //Sets the value of private environment variable API_KEY to the variable key
    return { key };
    //Returns 'key' from the load function, making it accessible from the svelte page component
}) satisfies PageServerLoad;
