import type { LayoutServerLoad } from "./$types";
//Imports the typescript type used to export page data

export const load = (async ({ cookies }) => {
     const sessionID = cookies.get("sessionID");
     return { sessionID };
}) satisfies LayoutServerLoad;

//This file exports the sessionID cookie so that the layout page can pass it into the navbar component's loggedIn boolean variable, which will either display 'Log In' and 'Sign Up' buttons, or 'Your Account' and 'Sign Out' buttons