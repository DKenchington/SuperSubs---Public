<script lang="ts">
    import { applyAction, enhance } from "$app/forms";
    //Sveltekit functions for handling form submission
    import { onMount } from "svelte";
    //Function which runs code once the svelte component has been mounted to the DOM
    import Header from "../../../components/Header.svelte";
    //Page header component
    import { sports, abilities } from "/src/lib/utils";
    //List of sports
    import { Loader } from "@googlemaps/js-api-loader";
    //The google maps api loader function
    import type { PageData } from "./$types";
    //Imports the page data type, used below

    export let data: PageData;
    //Sets pageData to the value of the data returned from the load function in the server.ts file


    let distance: number = 0;
    let address: string | undefined = data.address;
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

        function autocompleter() {
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
                place.geometry?.location.lat() +
                "," +
                place.geometry?.location.lng();
            //Sets location to the Lat Lng coordinates of the Google Maps autocomplete option selected
        }

        loader.load().then(() => {
            autocompleter();
        });
        //Calls the autocompleter() function once the Google Maps autocomplete api has loaded
    });
</script>

<Header
    header={"Create an availability"}
    pageTitle={"Working Title - Create an availability"}
/>
<!--Adds the page header component using the relevant parameters-->

<main>
    <form
        method="post"
        class="create-availability-wrapper"
        use:enhance={({ form, data, action, cancel }) => {
            return async ({ result, update }) => {
                applyAction(result);
            };
        }}
    >
    <!--The HTML form used to update account data. use:enhance is a svelteKit function, which I use to fill the input fields with the form data submitted once the form is submitted-->
        <div>
            <label for="startDateTime">Start date & time</label>
            <input
                type="datetime-local"
                id="startDateTime"
                name="startDateTime"
                required
            />
        </div>
        <div>
            <label for="endDateTime">End date & time</label>
            <input
                type="datetime-local"
                id="endDateTime"
                name="endDateTime"
                required
            />
        </div>
        <div>
            <label for="sport">Sport</label>
            <select class="sport" name="sport" required>
                <option value="default" selected disabled>Select a sport</option
                >
                {#each sports as sport}
                    <option value={sport}>
                        {sport}
                    </option>
                {/each}
            </select>
        </div>
        <div>
            <label for="ability">Your ability</label>
            <select class="ability" name="ability" required>
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
            <label for="ship-address">Your location</label>
            <input
                id="ship-address"
                name="address"
                type="text"
                bind:value={address}
                required
            />
            <input
                type="text"
                name="location"
                value={location}
                required
                hidden                
            />
        </div>
        <div>
            <label for="distance">Max distance</label>
            <input
                type="range"
                min="1"
                max="100"
                step="1"
                id="distance"
                name="distance"
                required
                bind:value={distance}
            />
            <span>{distance} miles</span>
        </div>
        <div class="center-grid-button">
            <button type="submit">Create availability</button>
        </div>
    </form>
</main>

<style>
    .create-availability-wrapper {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 15px;
        background-color: hsl(0, 0%, 85%);
        border-radius: 5px;
        margin: 15px;
        padding: 15px;
    }

    div:not(.map) {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
    }

    button {
        width: 150px;
    }
</style>
