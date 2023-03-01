<script lang="ts">
    import { applyAction, enhance } from "$app/forms";
    //Sveltekit functions for handling form submission
    import { onMount } from "svelte";
    //Function which runs code once the svelte component has been mounted to the DOM
    import Header from "../../../components/Header.svelte";
    //Page header component
    import { Loader } from "@googlemaps/js-api-loader";
    //The google maps api loader function
    import type { PageData } from "./$types";
    //Imports the page data type, used below
    import {  sports, abilities } from "$lib/utils";
    //Imports list of sports, object of abilities and their numeric values, and function to change the height of <textarea> on input
    import { page } from "$app/stores";
    //Imports data about the page, including error status

    export let data: PageData;

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
                place.geometry.location.lng().toString();
            //Sets location to the Lat Lng coordinates of the Google Maps autocomplete option selected
        }

        loader.load().then(() => {
            initialize();
        });
        //Calls the autocompleter() function once the Google Maps autocomplete api has loaded
    });
</script>

<Header
    header={"Create an event"}
    pageTitle={"Working Title - Create an event"}
/>
<!--Adds the page header component using the relevant parameters-->

<main>
    <form
        method="post"
        class="create-event-wrapper"
        use:enhance={({ form, data, action, cancel }) => {
            return async ({ result, update }) => {
                applyAction(result);
            };
        }}
    >
    <!--The HTML form used to update account data. use:enhance is a svelteKit function, which I use to fill the input fields with the form data submitted once the form is submitted-->
        <div>
            <label for="title">Title</label>
            <input required id="title" name="title" type="text" />
        </div>

        <div>
            <label for="description">Description</label>
            <textarea required id="description" name="description" on:input={() => {
                let element = document.getElementById("description");
                element.style.height = "25.5px";
                element.style.height = (element.scrollHeight - 2.5).toString() + "px";
            }}></textarea>
            <!--Automatically changes the height of textarea field on input-->
        </div>

        <div>
            <label for="sport">Sport</label>
            <select required class="sport" name="sport">
                <option value="" selected disabled>Select a sport</option>
                {#each sports as sport}
                    <option value={sport}>
                        {sport}
                    </option>
                {/each}
            </select>
        </div>

        <div>
            <label for="ability">Ability</label>
            <select required class="ability" name="ability">
                <option value="" selected disabled
                    >Select an ability level</option
                >
                {#each Object.entries(abilities) as [value, level]}
                    <option {value}>
                        {level}
                    </option>
                {/each}
            </select>
        </div>

        <div>
            <label for="startDateTime">Start date & time</label>
            <input
                required
                id="startDateTime"
                name="startDateTime"
                type="datetime-local"
            />
        </div>

        <div>
            <label for="endDateTime">End date & time</label>
            <input
                required
                id="endDateTime"
                name="endDateTime"
                type="datetime-local"
            />
        </div>

        <div>
            <label for="ship-address">Address</label>
            <input
                id="ship-address"
                type="text"
                name="address"
                placeholder="Enter your address"
                bind:value={address}
                required
            />
            <input
                type="text"
                name="location"
                value={location}
                hidden
                required
            />
        </div>

        <div>
            <button type="submit">Create event</button>
            {#if $page.status === 400}
                <div class="error-message-wrapper">Something went wrong!</div>
            {/if}
            <!--Displays error message if error 400 is returned-->
        </div>
    </form>
</main>

<style>
    .create-event-wrapper {
        background-color: hsl(0, 0%, 85%);
        border-radius: 5px;
        margin: 15px;
        display: grid;
        grid-template-columns: 1fr 1fr;
        padding: 10px;
        gap: 10px;
    }

    .create-event-wrapper > div {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
    }
</style>
