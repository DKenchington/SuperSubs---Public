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
    import { abilities, formatDate } from "$lib/utils";
    //Function which runs code once the svelte component has been mounted to the DOM

    export let data: PageData;
    //Sets data to the value of the data returned from the load function in the server.ts file

    let address: any = data.address;

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
        }

        loader.load().then(() => {
            initialize();
        });
        //Calls the initialise function once the Google Maps autocomplete api has loaded
    });
</script>

<main>
    <div class="result">
        <div class="header-wrapper">
            <h2>{data.eventData.title}</h2>
        </div>

        <div class="event-grid">
            <h3>Description</h3>
            <h3>Sport</h3>
            <h3>Start date & time</h3>

            <span>{data.eventData.description}</span>

            <span>{data.eventData.sport}</span>

            <span>{formatDate(parseInt(data.eventData.startDateTime))}</span>

            <h3>Ability level</h3>
            <h3>Address</h3>
            <h3>End date & time</h3>

            <span>{abilities[data.eventData.ability]}</span>

            <span>{data.eventData.address}</span>

            <span>{formatDate(parseInt(data.eventData.endDateTime))}</span>
        </div>
    </div>

    <form method="post" class="form-wrapper"
        use:enhance={({ form, data, action, cancel }) => {
        return async ({ result, update }) => {
            applyAction(result);
        };
    }}>
        <div>
            <h3>Contact Form</h3>
        </div>

        <input hidden type="text" name="accountID" value={data.accountData.accountID}>

        <input hidden type="text" name="eventID" value={data.eventID}>

        <div class="username">
            <label for="username">Username</label>
            <input type="text" name="username" value={data.accountData.username}>
        </div>

        
        <div class="message">
            <label for="message">Message</label>
            <textarea id="message" name="message" on:input={() => {
                let element = document.getElementById("message");
                element.style.height = "25.5px";
                element.style.height = (element.scrollHeight - 2.5).toString() + "px";
            }}></textarea>
        </div>
        
        <div class="email">
            <label for="email">Email address</label>
            <input type="email" name="email" value={data.accountData.email}>
        </div>

        <div class="phone">
            <label for="phone">Phone number</label>
            <input type="tel" name="phone" value={data.accountData.phone}>
        </div>

        <div>
            <button type="submit">Send</button>
        </div>
    </form>
</main>

<style>
    main {
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        align-items: center
    }

    .event-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }

    .header-wrapper {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
    }

    .result {
        background-color: hsl(0, 0%, 85%);
        border-radius: 5px;
        margin: 15px 15px 15px 15px;
        padding: 15px;
        max-width: 800px;
    }

    .form-wrapper {
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        background-color: hsl(0, 0%, 85%);
        border-radius: 5px;
        margin: 0 15px 15px 15px;
        padding: 15px;
    }

    .form-wrapper > div {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .form-wrapper label {
        flex-basis: 100%;
    }

    button {
        width: 100%;
    }
</style>