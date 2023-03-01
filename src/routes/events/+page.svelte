<script lang="ts">
    import Header from "../../components/Header.svelte";
    import { page } from "$app/stores";
    import type { PageData } from "./$types";
    import { applyAction, enhance } from "$app/forms";
    import { Loader } from "@googlemaps/js-api-loader";
    import { onMount } from "svelte";
    import { formatDate, sports, abilities } from "/src/lib/utils.ts";

    export let data: PageData;

    let currentlyEditing: number | null = null;
    let address: any = {};
    let location: any = {};
    let input: HTMLInputElement;
    let id: number;

    data.events.forEach(function (element) {
        location[element.eventID] = element.location;
    });

    data.events.forEach(function (element) {
        address[element.eventID] = element.address;
    });
    //Populates the locations obejct with each event's ID and coords

    onMount(() => {
        let autocomplete: any = {};
        //Defines a new global class google maps autocomplete which can have its constructors called from anywhere

        const loader = new Loader({
            apiKey: data.key,
            version: "weekly",
            libraries: ["places"],
        });
        //Creates an instance of the google maps api loader

        function initialize(input: HTMLInputElement) {
            const options = {
                componentRestrictions: { country: "uk" },
                fields: ["formatted_address", "geometry"],
            };
            autocomplete[id] = new google.maps.places.Autocomplete(
                input,
                options
            );
            autocomplete[id].addListener("place_changed", fillInAddress);
        }
        //Creates a new instance of the Google Maps autocomplete class attached to the input field
        //Adds a listener to get place data whenever the input field is edited

        function fillInAddress() {
            var place = autocomplete[id].getPlace();
            address[id] = place.formatted_address;
            location[id] =
                place.geometry.location.lat().toString() +
                "," +
                place.geometry.location.lng().toString();
        }
        //Listener function updates address and location objects for that event with new data to be displayed

        loader.load().then(() => {
            //Executes this code only once the Maps API has loaded
            data.events.forEach(function (element) {
                id = element.eventID;
                input = document.getElementById(
                    element.eventID.toString()
                ) as HTMLInputElement;
                initialize(input);
                //Executes this code once for each event displayed, creating new instances of the autocompleter and the geocoder
            });
        });
    });

    function handleClick(eventID: number) {
        currentlyEditing = eventID;
        id = eventID;
    }
    //Updates variables with the id of the availability currently being edited
</script>

<Header
    header={"View your events"}
    pageTitle={"Working Title - View your events"}
/>
<!--Adds the page header component using the relevant parameters-->

<main>
    {#each data.events as event}
    <!--Renders the code below for each availability in the database-->
        <div class="events-wrapper">
            <form
                method="post"
                action="?/update"
                class="update-events-wrapper"
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
                    <input
                        class="h2"
                        name="title"
                        type="text"
                        value={event.title}
                        readonly={currentlyEditing !== event.eventID}
                    />
                    {#if currentlyEditing !== event.eventID}
                        <button on:click={handleClick(event.eventID)}
                            >Edit event</button
                        >
                    {:else}
                        <button type="submit">Save changes</button>
                    {/if}
                    <!--Displays a button to edit this availability if not already being edited, and displays a button to save changes if already being edited-->
                </div>

                <input type="hidden" name="eventID" value={event.eventID} />
                <!--Readonly input field which returns the availabilityID (this never changes)-->

                <div class="event-grid">

                    <h3>Description</h3>
                    <h3>Sport</h3>
                    <h3>Start date & time</h3>

                    <input
                        type="text"
                        name="description"
                        value={event.description}
                        readonly={currentlyEditing !== event.eventID}
                    />

                    <select
                        name="sport"
                        disabled={currentlyEditing !== event.eventID}
                        required
                    >
                        {#each sports as sport}
                            <option value={sport} selected={sport === event.sport}>
                                {sport}
                            </option>
                        {/each}
                    </select>

                    <input
                        type="datetime-local"
                        name="startDateTime"
                        value={formatDate(parseInt(event.startDateTime))}
                        readonly={currentlyEditing !== event.eventID}
                        required
                    />

                    <h3>Ability level</h3>
                    <h3>Address</h3>
                    <h3>End date & time</h3>

                    <select
                        name="ability"
                        disabled={currentlyEditing !== event.eventID}
                        required
                    >
                        {#each Object.entries(abilities) as [value, level]}
                            <option
                                {value}
                                selected={parseInt(value) === event.ability}
                            >
                                {level}
                            </option>
                        {/each}
                    </select>

                    <input
                        type="text"
                        name="address"
                        id={event.eventID.toString()}
                        bind:value={address[event.eventID]}
                        readonly={currentlyEditing !== event.eventID}
                        required
                    />
                    <input
                        type="text"
                        name="location"
                        bind:value={location[event.eventID]}
                        readonly={currentlyEditing !== event.eventID}
                        required
                        hidden
                    />
                    <input
                        type="datetime-local"
                        name="endDateTime"
                        value={formatDate(parseInt(event.endDateTime))}
                        readonly={currentlyEditing !== event.eventID}
                        required
                    />
                    <!--Inputs in this grid are all readonly unless the button to edit that availability has been clicked-->
                </div>
            </form>
            <form method="post" action="?/delete">
                <button type="submit">Delete event</button>
                <input type="text" value={event.eventID} name="eventID" hidden />
            </form>
            <!--Submits the form and calls the delete function in the page.server.ts file-->
        </div>
    {:else}
        <div class="no-listings">
            <a href="events/create">Create your first event</a>
        </div>
    {/each}
</main>

<style>
    .events-wrapper {
        background-color: hsl(0, 0%, 85%);
        border-radius: 5px;
        margin: 15px;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        padding: 15px;
    }

    input.h2 {
        font-weight: 300;
        margin: 5px 0;
        display: block;
        font-size: 1.5em;
        margin-block-start: 0.83em;
        margin-block-end: 0.83em;
        margin-inline-start: 0px;
        margin-inline-end: 0px;
        font-weight: bold;
    }

    h3 {
        font-weight: 300;
        margin: 10px 0px;
    }

    .event-grid {
        display: grid;
        grid-template-columns: 1fr 1fr 1fr;
    }

    .event-grid > * {
        margin-right: 10px;
    }

    .header-wrapper {
        display: flex;
        justify-content: space-between;
    }

    .update-events-wrapper {
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
