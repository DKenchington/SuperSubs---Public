<script lang="ts">
    import Header from "../components/Header.svelte";
    import { Loader } from "@googlemaps/js-api-loader";
    import { onMount } from "svelte";
    import { sports, abilities, formatDate } from "$lib/utils";
    import type { PageData } from "./$types";

    export let data: PageData;
    let minAbility: number = parseInt(data.searchTerms.minAbility);
    let maxAbility: number = parseInt(data.searchTerms.maxAbility);
    let minDuration: number = parseFloat(data.searchTerms.minDuration);
    let maxDuration: number = parseFloat(data.searchTerms.maxDuration);
    let startDateTime: string = data.searchTerms.startDateTime;
    let endDateTime: string = data.searchTerms.endDateTime;
    let address: any = data.searchTerms.address;
    let location: any = data.searchTerms.location;
    let selectAll: boolean = true;
	let sort: string = data.searchTerms.sort;
	let order: string = data.searchTerms.order;

    onMount(() => {
        let autocomplete: google.maps.places.Autocomplete;
        //Defines a new autocomplete widget (class)

        const loader = new Loader({
            apiKey: data.key,
            version: "weekly",
            libraries: ["places"],
        });

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
    });
</script>

<Header header="Search" pageTitle="Working Title - Search" />

<main>
    <form method="get" class="search-wrapper">
        <input type="hidden" name="filters" value="true" />
        <div class="sports-list">
            <label for="all"><strong>Select all</strong></label>
            <input type="checkbox" id="all" bind:checked={selectAll} />
            {#each sports as sport}
                <label for={sport}>{sport}</label>
                <input
                    type="checkbox"
                    name={sport}
                    id={sport}
                    checked={selectAll || data.searchTerms[sport] === "on"}
                />
            {/each}
        </div>

        <div class="ability">
            <label for="minAbility">Min ability</label>
            <input
                type="range"
                name="minAbility"
                min="1"
                max="5"
                step="1"
                bind:value={minAbility}
            />
            <label for="maxAbility">Max ability</label>
            <input
                type="range"
                name="maxAbility"
                min="1"
                max="5"
                step="1"
                bind:value={maxAbility}
            />
        </div>

        <div class="dateTime">
            <label for="startDateTime">Start date & time</label>
            <input
                name="startDateTime"
                type="datetime-local"
                bind:value={startDateTime}
            />
            <label for="endDateTime">End date & time</label>
            <input
                name="endDateTime"
                type="datetime-local"
                bind:value={endDateTime}
            />
        </div>

        <div class="duration">
            <label for="minDuration">Min duration</label>
            <input
                type="range"
                name="minDuration"
                step="0.25"
                min="0"
                max="37.5"
                bind:value={minDuration}
            />
            {Math.floor(minDuration)} hours {(minDuration % 1) * 60} minutes
            <label for="maxDuration">Max duration</label>
            <input
                type="range"
                name="maxDuration"
                step="0.25"
                min="0"
                max="37.5"
                bind:value={maxDuration}
            />
            {Math.floor(maxDuration)} hours {(maxDuration % 1) * 60} minutes
        </div>

        <div class="location">
            <label for="ship-address">Your address</label>
            <input
                type="text"
                name="address"
                id="ship-address"
                bind:value={address}
            />
            <input type="text" name="location" hidden value={location} />
        </div>

        <div class="sort">
            <label for="sort">Sort by</label>
            <div class="break"></div>
            <select name="sort" class="sort" id="sort" bind:value={sort}>
                <option value="duration">Duration</option>
                <option value="distance">Distance</option>
            </select>
            <select name="order" class="sort" id="order" bind:value={order}>
                <option value="desc">Desc</option>
                <option value="asc">Asc</option>
            </select>
        </div>

        <div class="submit">
            <button class="form-submit" type="submit">Search</button>
        </div>
    </form>

    <div class="search-results">
        {#each data.results as result}
            <div class="result">
                <form class="header-wrapper" method="post">
                    <h2>{result.title}</h2>
                    <input type="hidden" name="eventID" value={result.eventID}>
                    <button type="submit">Apply to this event</button>
                </form>

                <div class="event-grid">
                    <h3>Description</h3>
                    <h3>Sport</h3>
                    <h3>Start date & time</h3>

                    <span>{result.description}</span>

                    <span>{result.sport}</span>

                    <input
                        type="datetime-local"
                        name="startDateTime"
                        value={formatDate(parseInt(result.startDateTime))}
                        readonly
                        required
                    />

                    <h3>Ability level</h3>
                    <h3>Address</h3>
                    <h3>End date & time</h3>

                    <span>{abilities[result.ability]}</span>

                    <span>{result.address}</span>

                    <input
                        type="datetime-local"
                        name="endDateTime"
                        value={formatDate(parseInt(result.endDateTime))}
                        readonly
                        required
                    />
                </div>
            </div>
        {/each}
    </div>
</main>

<!--Search for events by:
	sport: checkboxes
	ability: range sliders
	start & end datetime
	min max duration
	your location

	sort by:
	distance
	duration
-->
<style>
    main {
        display: flex;
		flex-direction: row;
    }

    .search-wrapper {
        margin: 15px;
        padding: 15px 15px;
        background-color: #d9d9d9;
        border-radius: 5px;
        display: flex;
        flex-direction: column;
        align-items: center; 
    }

	.search-results {
		flex-grow: 1
	}

    .ability,
    .dateTime,
    .duration,
    .location,
    .submit,
    .sports-list {
        display: flex;
        flex-direction: column;
        align-items: center;
        margin-bottom: 10px;
    }

    .sort {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
    }

    .sort > select{
        border-radius: 0px;
    }

    .sort > select:hover:focus{
        border-radius: 0px;
        border: none;
        outline: 1px solid #3c6e71 !important;
    }

    .sports-list {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        font-size: small;
        gap: 3px;
        width: 200px;
        justify-items: center;
    }

    .submit {
        grid-column-start: 1;
        grid-column-end: 4;
    }

    .form-submit {
        width: 150px;
    }

    input[readonly] {
        background-color: transparent;
        border-width: 0;
        outline-width: 0;
        color: black;
        appearance: none;
        font-family: inherit;
        opacity: 1;
        width: 100%;
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
        margin-bottom: 5px;
    }

    .result {
        background-color: hsl(0, 0%, 85%);
        border-radius: 5px;
        margin: 15px 15px 15px 0;
        padding: 15px;
    }
</style>
