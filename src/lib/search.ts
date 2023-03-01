import prisma from "$lib/client";
import { findDistance, sports } from "./utils";

export async function search(
    searchTerms: any,
    sportsList: any,
    sort: "duration" | "distance",
    order: "asc" | "desc"
) {
    console.log(sportsList)
    let results = await prisma.events.findMany({
        where: {
            AND: [
                {
                    sport: { in: sportsList },
                    startDateTime: {
                        gte: Date.parse(searchTerms.startDateTime).toString(),
                    },
                    endDateTime: {
                        lte: Date.parse(searchTerms.endDateTime).toString(),
                    },
                    ability: { lte: parseInt(searchTerms.maxAbility) },
                    duration: {
                        lte: parseInt(searchTerms.maxDuration) * 360000,
                    },
                },
                {
                    ability: { gte: parseInt(searchTerms.minAbility) },
                    duration: {
                        gte: parseInt(searchTerms.minDuration) * 360000,
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
            duration: order,
        },
    });
    // let distances: any = [];
    // results.forEach((element) => {
    //     distances[element.eventID] = findDistance(element.location, searchTerms.location);
    // });
    // let results_temp = results;
    // let minDistance: number = 1000;
    // let count: number= 0;
    // results_temp.forEach((element) => {
    //     distances.forEach((distance: any) => {
    //         if (distances[distance.eventID] < minDistance) {
    //             results[count] = results_temp[element.eventID]
    //         }
    //     })
    // })
    if (sort === "distance") {
        console.log(results);
        results.sort((a, b) => {
            let distanceA = findDistance(a.location, searchTerms.location);
            let distanceB = findDistance(b.location, searchTerms.location);
            if (order === "asc") return distanceA - distanceB;
            else return distanceB - distanceA;
        });
        console.log(results);
    }
    return results;
}
