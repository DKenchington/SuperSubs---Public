<script lang="ts">
    import Header from "../../../components/Header.svelte";
    //Page header component
    import { applyAction, enhance } from "$app/forms";
    //Sveltekit functions for handling form submission
    import { page } from "$app/stores";
    //Svelte store which contains page data, including error status
    import { onMount } from "svelte";
    //Function which runs code once the svelte component has been mounted to the DOM
    import { Loader } from "@googlemaps/js-api-loader";
    //The google maps api loader function
    import type { PageData } from "./$types";
    //Imports the page data type, used below

    export let data: PageData;
    //Sets pageData to the value of the data returned from the load function in the server.ts file

    let address: any;
    let location: any;

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

        function initialise() {
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
                place.geometry.location.lat().toString()
            //Sets location to the Lat Lng coordinates of the Google Maps autocomplete option selected
        }

        loader.load().then(() => {
            initialise();
        });
        //Calls the initialise function once the Google Maps autocomplete api has loaded
    });
</script>

<Header
    header={"Create an account"}
    pageTitle={"Working Title - Create an account"}
/>
<!--Adds the page header component using the relevant parameters-->

<main>
    <form
        method="post"
        class="create-account-wrapper"
        use:enhance={({ form, data, action, cancel }) => {
            return async ({ result, update }) => {
                applyAction(result);
            };
        }}
    >
    <!--The HTML form used to update account data. use:enhance is a svelteKit function, which I use to fill the input fields with the form data submitted once the form is submitted-->
        <label for="Username">Username</label>
        <input
            id="Username"
            name="username"
            type="text"
            placeholder="Enter your username"
            required
        />
        <label for="Email">Email</label>
        <input
            id="Email"
            name="email"
            type="email"
            placeholder="Enter your email address"
            required
        />
        <label for="Password">Password</label>
        <input
            id="Password"
            name="password"
            type="password"
            placeholder="Enter your password"
            required
        />
        <label for="ship-address">Address</label>
        <input
            id="ship-address"
            type="text"
            name="address"
            placeholder="Enter your address"
            bind:value={address}
            required
        />
        <!--bind:value is a svelte function which allows input field's data to be set to the value of a variable, and visa versa-->
        <input type="text" name="location" value={location} required hidden />
        <label for="Phone number">Phone number</label>
        <input
            id="Phone number"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            required
        />
        <button type="submit">Create your account</button>
        {#if $page.status === 400}
            <div id="error-message">Something went wrong!! :((</div>
        {/if}
        <!--If an error 400 is returned from the page.server file, display an error message-->
    </form>
</main>

<style>
    main {
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .create-account-wrapper {
        margin: 15px;
        padding: 10px 15px;
        background-color: #d9d9d9;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        flex-wrap: wrap;
        text-align: center;
    }

    .create-account-wrapper > label {
        margin: 5px 0px;
    }
</style>
