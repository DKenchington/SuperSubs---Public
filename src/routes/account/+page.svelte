<script lang="ts">
    import { applyAction, enhance } from "$app/forms";
    //Sveltekit functions for handling form submission
    import { page } from "$app/stores";
    //Svelte store which contains page data, including error status
    import Header from "../../components/Header.svelte";
    //Page header component
    import type { PageData } from "./$types";
    //Imports the page data type, used below
    import { Loader } from "@googlemaps/js-api-loader";
    //The google maps api loader function
    import { onMount } from "svelte";
    //Function which runs code once the svelte component has been mounted to the DOM

    export let data: PageData;
    //Sets data to the value of the data returned from the load function in the server.ts file

    let address: any = data.address;
    let location: any = data.location;

    onMount(() => {
        let autocomplete: google.maps.places.Autocomplete;
        //Defines a new autocomplete widget (class)

        const loader = new Loader({
            apiKey: data.key,
            version: "weekly",
            libraries: ["places"],
        });
        //Defines a new instance of the google maps api loader using the api key exported from the server.ts file

        var input = document.getElementById("ship-address") as HTMLInputElement;
        //Gets the input element that Google Maps autocomplete will be used with and sets it to the value of variable 'input' as type HTMLInputElement

        function initialize() {
            const options = {
                componentRestrictions: { country: "uk" },
                fields: ["formatted_address", "geometry"],
            };
            //Object containing parameters to be used with Google Maps autocomplete
            autocomplete = new google.maps.places.Autocomplete(input, options);
            //Defines a new instance of Google Maps autocomplete using the above parameters and attaches it to the input element
            autocomplete.addListener("place_changed", fillInAddress);
            //Adds an event listener which calls fillInAddress() whenever an autocomplete option is selected
        }

        function fillInAddress() {
            const place = autocomplete.getPlace();
            //Gets data about the Google Maps autocomplete option selected, returns an object
            address = place.formatted_address;
            location =
                place.geometry.location.lat().toString() +
                "," +
                place.geometry.location.lat().toString();
            //Sets location to the Lat Lng coordinates of the Google Maps autocomplete option selected
        }

        loader.load().then(() => {
            initialize();
        });
        //Calls the initialise function once the Google Maps autocomplete api has loaded
    });
</script>

<Header header={"Your account"} pageTitle={"Working Title - Your account"} />
<!--Adds the page header component using the relevant parameters-->

<main>
    <form
        method="post"
        action="?/updateAccount"
        use:enhance={({ form, data, action, cancel }) => {
            return async ({ result, update }) => {
                applyAction(result);
            };
        }}
    >
        <!--Calls the updateAccount function in the page.server.ts file when the form is submitted-->
        <!--The HTML form used to update account data. use:enhance is a svelteKit function, which I use to fill the input fields with the form data submitted once the form is submitted-->
        <div class="form-data-wrapper-wrapper">
            <div class="form-data-wrapper">
                <div class="col-1">
                    <label for="username">Username</label>
                    <input
                        class="username"
                        type="text"
                        name="username"
                        value={data.username}
                        required
                    />
                    <label for="email">Email</label>
                    <input
                        class="email"
                        type="email"
                        name="email"
                        value={data.email}
                        required
                    />
                    <label for="phone">Phone number</label>
                    <input
                        class="phone"
                        type="tel"
                        name="phone"
                        value={data.phone}
                    />
                </div>
                <div class="col-2">
                    <label for="new-password">New password</label>
                    <input
                        class="new-password"
                        type="password"
                        name="newPassword"
                        value={data.password}
                        class:error={$page.status === 400}
                        required
                    />
                    <label for="password-confirmation"
                        >Confirm new password</label
                    >
                    <input
                        class="password-confirmation"
                        type="password"
                        name="password"
                        value={data.password}
                        class:error={$page.status === 400}
                        required
                    />
                    <label for="ship-address">Address</label>
                    <input
                        id="ship-address"
                        type="text"
                        value={address}
                        name="address"
                    />
                    <input
                        type="text"
                        name="location"
                        value={location}
                        hidden
                    />
                </div>
            </div>
            <div class="button-wrapper">
                <button type="submit">Update data</button>
            </div>
        </div>
        <div class="events-wrapper">
            <h3><a href="./events/create">Create an event</a></h3>
            <h3><a href="./events">View/edit your events</a></h3>
        </div>
        <div class="availabilities-wrapper">
            <h3>
                <a href="./availabilities/create">Create an availability</a>
            </h3>
            <h3>
                <a href="./availabilities/">View/edit your availabilities</a>
            </h3>
        </div>
    </form>
    <form method="post" action="?/signOut" class="sign-out-wrapper">
        <button type="submit">Sign out</button>
    </form>
    <!--Submits the form and calls the signOut function in the page.server.ts file-->
</main>

<style>
    form {
        display: grid;
        gap: 15px;
        grid-template-columns: 1fr 1fr;
    }

    .form-data-wrapper-wrapper {
        display: inline;
        grid-column: 1;
        grid-row-start: 1;
        grid-row-end: 3;
        background-color: #d9d9d9;
        border-radius: 5px;
        margin-top: 15px;
        margin-left: 15px;
        padding-top: 15px;
    }

    .events-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        grid-column: 2 / 2;
        grid-row: 1 / 1;
        background-color: #d9d9d9;
        border-radius: 5px;
        margin: 15px 15px 0 0;
        padding: 10px 15px 10px 15px;
    }

    .availabilities-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        grid-column: 2 / 2;
        grid-row: 2 / 2;
        background-color: #d9d9d9;
        border-radius: 5px;
        margin-right: 15px;
        padding: 10px 15px 10px 15px;
    }

    .form-data-wrapper {
        display: flex;
        flex-direction: row;
        justify-content: space-evenly;
    }

    .col-1 {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }

    .col-2 {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
    }

    input {
        padding-left: 10px;
    }

    .button-wrapper {
        display: flex;
        justify-content: center;
        padding: 10px 0px;
        padding-bottom: 18px;
    }

    .sign-out-wrapper {
        display: flex;
        justify-content: center;
        margin: 0 15px;
        padding: 10px 0;
    }

    h3 {
        margin: 10px 0 15px 0;
    }

    button {
        width: 142px;
    }

    a {
        text-decoration: none;
        color: black;
    }

    a:hover {
        color: #3c6e71;
    }
</style>
