import { API_KEY } from "$env/static/private";
import prisma from "$lib/client";
import { fail, redirect, type Actions } from "@sveltejs/kit";
import type { PageServerLoad } from "../$types";

export const load = (async({cookies}) => {
    let eventID: string | undefined;
    let key = API_KEY;

    if (cookies.get("eventID") === undefined) {
        throw redirect(307, "/");
    } else {
        eventID = cookies.get("eventID");
    }
    const eventData = prisma.events.findUnique({
        where: {eventID: parseInt(eventID)},
        select: {
            title: true,
            description: true,
            sport: true,
            ability: true,
            startDateTime: true,
            endDateTime: true,
            address: true,
            accountID: true,
        }
    });
    let accountData: any = {}
    if (cookies.get("sessionID") !== undefined) {
        accountData = prisma.accounts.findUnique({
            where: {
                accountID: parseInt(cookies.get("sessionID"))
            },
            select: {
                accountID: true,
                email: true,
                username: true,
                location: true,
                address: true,
                phone: true,
            },
        })
    } else {
        accountData = {
            accountID: null,
            email: null,
            username: null,
            location: null,
            address: null,
            phone: null
        }
    }
    return {eventID, accountData, eventData, key}
}) satisfies PageServerLoad

export const actions = {
    default: async ({ cookies, request }) => {
        let formData: any = {};
        
        (await request.formData()).forEach((value, key) => (formData[key] = value));
        // try {
            await prisma.contact_forms.create({
                data: {
                    username: formData.username,
                    message: formData.message,
                    email: formData.email,
                    phone: formData.phone,
                    events: {connect: {eventID: parseInt(formData.eventID)}},
                    accounts: {connect: {accountID: parseInt(formData.accountID)}}
                },
            })
        // } catch {
        //     return fail(400, formData)
        // };
        throw redirect(307, "/");
    },
} satisfies Actions;