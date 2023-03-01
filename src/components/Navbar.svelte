<script lang="ts">
    export let loggedIn: boolean;
    //Exports a boolean variable which is assigned when the navbar is imported as a component into the layout file
</script>

<nav>
    <div style="font-weight:400; font-style:italic">Working Title</div>
    <a href="/"><div>Find events</div></a>
    <a href="/availabilities/create"><div>Get notified of an event</div></a>
    <a href="/events/create"><div>Create an event</div></a>
    {#if loggedIn}
        <a href="/account"><div>Your account</div></a>
        <form method="post" action="/account?/signOut"><button type="submit" class="icon-button"><div class="svg-container"><svg width="25px" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.3.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"/></svg></div></button></form>
        <!--If the user is logged in, a link to the account page and a button to signout is shown-->
        <!--signOut is a form action method defined in the typescript file of the accounts page-->
    {:else}
        <a href="/account/login"><div>Log in</div></a>
        <a href="/account/create"><div class="svg-container"><svg width="25px" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><!-- Font Awesome Pro 6.0.0-alpha2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) --><path d="M224 256C294.695 256 352 198.691 352 128S294.695 0 224 0C153.312 0 96 57.309 96 128S153.312 256 224 256ZM274.664 304H173.336C77.609 304 0 381.602 0 477.332C0 496.477 15.523 512 34.664 512H413.336C432.477 512 448 496.477 448 477.332C448 381.602 370.398 304 274.664 304ZM616 200H568V152C568 138.75 557.25 128 544 128S520 138.75 520 152V200H472C458.75 200 448 210.75 448 224S458.75 248 472 248H520V296C520 309.25 530.75 320 544 320S568 309.25 568 296V248H616C629.25 248 640 237.25 640 224S629.25 200 616 200Z"/></svg></div></a>
        <!--If the user is not logged in, links to the login and account creation pages are shown-->    
    {/if}
</nav>
<!--This is the navbar component which is defined as sitting above the content of every page in the layout file-->

<style>
    nav {
        display: flex;
        align-items: center;
        background-color: hsl(204, 42%, 27%);
        color: white;

    }

    nav > * {
        min-height: 50px;
        display: flex;
        flex-grow: 1;
        align-items: center;
        justify-content: center;
        text-decoration: none;
        font-weight: 300;
    }

    a > div, button.icon-button > div {
        color: white;
        text-align: center;
        padding: 0 5px;
    }

    a:hover, form:hover {
        background-color: hsl(204, 42%, 37%);
    }

    .icon-button {
        background-color: transparent;
        border: none;
        outline: none;
        width: 100%;
        padding: 0;
        border-radius: 0;
        margin: 0px;
    }
</style>
