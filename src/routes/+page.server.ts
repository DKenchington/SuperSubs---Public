import { API_KEY } from "$env/static/private";
import prisma from "../lib/client";
import type { Actions, PageServerLoad } from "./$types";
import { sports, findDistance } from "$lib/utils";
import { redirect } from "@sveltejs/kit";

export const actions = {
    default: async ({ cookies, request }) => {
        let data: any = {};
        (await request.formData()).forEach((value: any, key: any) => (data[key] = value));
        cookies.set("eventID", data.eventID.toString(), {path: "/"})
        throw redirect(307, '/contact_form')
    },
} satisfies Actions;

export const load = (async ({ url }) => {
    let results;
    let searchTerms = {
        filters: 'true',
        Football: 'on',
        Cricket: 'on',
        Hockey: 'on',
        Tennis: 'on',
        Volleyball: 'on',
        'Table Tennis': 'on',
        Baseball: 'on',
        Badminton: 'on',
        Squash: 'on',
        Basketball: 'on',
        Rugby: 'on',
        Handball: 'on',
        minAbility: '1',
        maxAbility: '5',
        startDateTime: '2023-01-01T00:00',
        endDateTime: '2024-01-01T00:00',
        minDuration: '0',
        maxDuration: '37.5',
        address: 'United Kingdom',
        location: '55.378051,-3.435973',
        sort: 'duration',
        order: 'desc'
      }
    if (url.searchParams.get("filters")) {
        searchTerms = Object.fromEntries(url.searchParams);

        const sportsList = [];
        for (const property in searchTerms) {
            if (sports.includes(property.toString())) {
                sportsList.push(property.toString());
            }
        }

        let minDuration = parseInt(searchTerms.minDuration) * 3600000;
        let maxDuration = parseInt(searchTerms.maxDuration) * 3600000;

        console.log(sportsList);
        console.log(searchTerms);

        results = await prisma.events.findMany({
            where: {                
                AND: [
                    {
                        sport: { in: sportsList},
                        startDateTime: {
                            gte: Date.parse(searchTerms.startDateTime).toString(),
                        },
                        endDateTime: {
                            lte: Date.parse(searchTerms.endDateTime).toString(),
                        },
                        ability: { lte: parseInt(searchTerms.maxAbility) },
                        duration: {
                            lte: maxDuration,
                        },
                    },
                    {
                        ability: { gte: parseInt(searchTerms.minAbility) },
                        duration: {
                            gte: minDuration,
                        },
                    },
                ],
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
            orderBy: {
                duration: searchTerms.order,
            },
        });
        if (searchTerms.sort === "distance") {
            console.log(results);
            results.sort((a, b) => {
                let distanceA = findDistance(a.location, searchTerms.location);
                let distanceB = findDistance(b.location, searchTerms.location);
                if (searchTerms.order === "desc") return distanceA - distanceB;
                else return distanceB - distanceA;
            });
            console.log(results);
            console.log(searchTerms)
        }
    } else {
        results = await prisma.events.findMany({
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
    }
    const key = API_KEY;
    return { key, results, searchTerms};
}) satisfies PageServerLoad;
