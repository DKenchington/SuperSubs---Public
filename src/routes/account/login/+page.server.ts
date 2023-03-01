import { error, fail, redirect } from "@sveltejs/kit";
//Imports svelteKit's built in error, fail, and redirect functions
import prisma from "../../../lib/client";
//Imports the prisma client used to access the database
import type { Actions } from "./$types";
//Imports the const types used to handle form submission

export const actions = {
    default: async ({ cookies, request }) => {
        //The default function called upon submission of form data
        let data: any = {};
        (await request.formData()).forEach((value, key) => (data[key] = value));
        //Binds data from the form submission request to the data object
        if (data.email == null) return fail(400); // remove this for fun error
        //If no email is submitted return a 400 error
        let user = await prisma.accounts.findUnique({
            where: {
                email: data.email,
            },
            select: {
                accountID: true,
                password: true,
            },
        });
        //Get password and accountID for the submitted email from the database
        if (user == null) {
            return fail(400);
        }
        //If the password and accountID don't exist, return a 400 error
        if (user.password === data.password) {
            cookies.set("sessionID", user.accountID.toString(), { path: "/" });
        } else {
            throw error(403);
        }
        //If the password inputted matches the password linked to the username, set the sessionID cookie to the accountID
        //Else, throw a 403 fail
        throw redirect(307, "/account");
        //Send the user to the account management page
    },
} satisfies Actions;
