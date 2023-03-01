import prisma from "../../lib/client";
//Prisma client used to query database
import { fail, redirect } from "@sveltejs/kit";
//SvelteKit functions for throwing fails, and redirect
import type { PageServerLoad } from "./$types";
//SvelteKit type used to load data
import type { Actions } from "./$types";
//SvelteKit type used to handle form submission
import { API_KEY } from "$env/static/private";
//Api key environment variable
import { ensureAuthenticated } from "$lib/utils";
//Function that redirects user to log in if sessionID is invalid or there is none

export const load = (async ({ cookies }) => {
    //Function that loads data to the page
    const sessionID = ensureAuthenticated(cookies)
    let data: any = {}
    data = await prisma.accounts.findUnique({
        where: {
            accountID: parseInt(sessionID),
        },
        select: {
            email: true,
            password: true,
            username: true,
            location: true,
            address: true,
            phone: true,
        },
    });
    data.key = API_KEY
    //Sets the value of private environment variable API_KEY to the variable key
    return data;
    //Returns account data and api key
}) satisfies PageServerLoad;

export const actions = {
    updateAccount: async ({ cookies, request }) => {
        //Update account form submit function
        let data: any = {};
        (await request.formData()).forEach((value, key) => (data[key] = value));
        if (data.password !== data.newPassword) return fail(400);
        delete data.newPassword;
        const sessionID = ensureAuthenticated(cookies)
        try {
            await prisma.accounts.update({
                where: { accountID: parseInt(sessionID) },
                data,
            });
        } catch {
            return fail(400, data);
        }
    },
    signOut: async ({ cookies, request }) => {
        cookies.delete("sessionID");
        throw redirect(307, "/account/login");
    },
} satisfies Actions;
