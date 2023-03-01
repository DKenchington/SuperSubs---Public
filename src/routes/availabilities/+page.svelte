<script lang="ts">
    import Header from "../../components/Header.svelte";
    //Page header component
    import type { PageData } from "./$types";
    //Imports the page data type, used below    
    import { applyAction, enhance } from "$app/forms";
    //Sveltekit functions for handling form submission
    import { Loader } from "@googlemaps/js-api-loader";
    //The google maps api loader function
    import { onMount } from "svelte";
    //Function which runs code once the svelte component has been mounted to the DOM
    import { formatDate, sports, abilities } from "/src/lib/utils.ts";
    //Function to convert JS date objects to datetime-local HTML input friendly strings, list of sports, and object containing ability levels and values

    export let data: PageData;
    //Sets data to the value of the data returned from the load function in the server.ts file


    let currentlyEditing: number | null = null;
    //Variable which stores the ID of the availability currently being edited
    let address: any = {};
    let location: any = {};
    let input: HTMLInputElement;
    let id: number;
    //Global variable declarations

    data.availabilities.forEach(function (element) {
        location[element.availabilityID] = element.location;
    });
    //Populates the location object with all the availability IDs and coords

    data.availabilities.forEach(function (element) {
        address[element.availabilityID] = element.address;
    });
    //Populates the address obejct with all the availability IDs and addresses

    onMount(() => {
        let autocomplete: any = {};

        const loader = new Loader({
            apiKey: data.key,
            version: "weekly",
            libraries: ["places"],
        });
        //Creates an instance of the google maps api loader

        function initialise(input: HTMLInputElement) {
            const options = {
                componentRestrictions: { country: "uk" },
                fields: ["formatted_address", "geometry"],
            };
            //Object containing parameters to be used with Google Maps autocomplete
            autocomplete[id] = new google.maps.places.Autocomplete(
                input,
                options
            );
            //Creates a new instance of Google Maps autocomplete linked to the targeted availability by its ID
            autocomplete[id].addListener("place_changed", fillInAddress);
            //Adds an event listener to that Google Maps autocomplete which calls fillInAddress() whenever an autocomplete option is selected
        }

        function fillInAddress() {
            var place = autocomplete[id].getPlace();
            //Gets data about the Google Maps autocomplete option selected for the availability being edited, returns an object
            address[id] = place.formatted_address;
            location[id] =
                place.geometry.location.lat().toString() +
                "," +
                place.geometry.location.lng().toString();
            //Sets location of the availability being edited to the Lat Lng coordinates of the Google Maps autocomplete option selected
        }

        loader.load().then(() => {
            //Executes this code only once the Maps API has loaded
            data.availabilities.forEach(function (element) {
                id = element.availabilityID;
                input = document.getElementById(
                    element.availabilityID.toString()
                ) as HTMLInputElement;
                initialise(input);
                //Initialises a new autocomplete instance for each availability being displayed
            });
        });
    });

    function handleClick(availabilityID: number) {
        currentlyEditing = availabilityID;
        id = availabilityID;
    }
    //Updates variables with the id of the availability currently being edited
</script>

<Header
    header={"View your availabilities"}
    pageTitle={"Working Title - View your availabilities"}
/>
<!--Adds the page header component using the relevant parameters-->

<main>
    {#each data.availabilities as availability}
    <!--Renders the code below for each availability in the database-->
        <div class="availability-wrapper">
            <form
                method="post"
                action="?/update"
                class="update-availabilitys-wrapper"
                use:enhance={({ form, data, action, cancel }) => {
                    return async ({ result, update }) => {
                        applyAction(result);
                        currentlyEditing = null;
                    };
                }}
            >
            <!--Calls the update function in the page.server.ts file when the form is submitted-->
            <!--The HTML form used to update account data. use:enhance is a svelteKit function, which I use to fill the input fields with the form data submitted once the form is submitted-->
                <div class="header-wrapper">
                    {#if currentlyEditing !== availability.availabilityID}
                        <button on:click={handleClick(availability.availabilityID)}
                            >Edit availability</button
                        >
                    {:else}
                        <button type="submit">Save changes</button>
                    {/if}
                    <!--Displays a button to edit this availability if not already being edited, and displays a button to save changes if already being edited-->
                </div>

                <input
                    type="hidden"
                    name="availabilityID"
                    value={availability.availabilityID}
                />
                <!--Readonly input field which returns the availabilityID (this never changes)-->
                <div class="availability-grid">
                    <h3>Sport</h3>
                    <h3>Start date & time</h3>
                    <h3>Your ability</h3>

                    <select
                        name="sport"
                        disabled={currentlyEditing !== availability.availabilityID}
                        required
                    >
                        {#each Object.entries(sports) as [value, level]}
                            <option {value} selected={value === availability.sport}>
                                {level}
                            </option>
                        {/each}
                    </select>

                    <input
                        type="datetime-local"
                        name="startDateTime"
                        value={formatDate(parseInt(availability.startDateTime))}
                        readonly={currentlyEditing !== availability.availabilityID}
                        required
                    />

                    <select
                        name="ability"
                        disabled={currentlyEditing !== availability.availabilityID}
                        required
                    >
                        {#each Object.entries(abilities) as [value, level]}
                            <option
                                {value}
                                selected={parseInt(value) === availability.ability}
                            >
                                {level}
                            </option>
                        {/each}
                    </select>

                    <h3>Your address</h3>
                    <h3>End date & time</h3>
                    <h3></h3>

                    <input
                        type="text"
                        name="address"
                        id={availability.availabilityID.toString()}
                        bind:value={address[availability.availabilityID]}
                        readonly={currentlyEditing !== availability.availabilityID}
                        required
                    />
                    <input
                        type="text"
                        name="location"
                        bind:value={location[availability.availabilityID]}
                        readonly={currentlyEditing !== availability.availabilityID}
                        required
                        hidden
                    />
                    <input
                        type="datetime-local"
                        name="endDateTime"
                        value={formatDate(parseInt(availability.endDateTime))}
                        readonly={currentlyEditing !== availability.availabilityID}
                        required
                    />
                    <!--Inputs in this grid are all readonly unless the button to edit that availability has been clicked-->
                </div>
            </form>
            <form method="post" action="?/delete">
                <button type="submit">Delete availability</button>
                <input
                    type="text"
                    value={availability.availabilityID}
                    name="availabilityID"
                    hidden
                />
            </form>
            <!--Submits the form and calls the delete function in the page.server.ts file-->
        </div>
    {:else}
        <div class="no-listings">
            <a href="availabilitys/create">Create your first availability</a>
        </div>
        <!--If not listings are found, display the above link to create one instead-->
    {/each}
</main>

<style>
    .availability-wrapper {
        background-color: hsl(0, 0%, 85%);
        border-radius: 5px;
        margin: 15px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 15px;
    }

    h3 {
        font-weight: 300;
        margin: 10px 0px;
    }

    .availability-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }

    .header-wrapper {
        display: flex;
        justify-content: flex-end;
    }

    .update-availabilitys-wrapper {
        flex-grow: 2;
        margin-right: 15px;
    }

    button {
        width: 150px;
    }

    select {
        margin: 3px 0 10px 0;
        height: 27px;
        padding: 1px 2px;
    }

    input[readonly],
    select[disabled] {
        background-color: transparent;
        border-width: 0;
        outline-width: 0;
        color: black;
        appearance: none;
        font-family: inherit;
        opacity: 1;
        width: 100%;
    }
</style>
