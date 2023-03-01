<script>
    import { applyAction, enhance } from "$app/forms";
    //Sveltekit functions for handling form submission
    import { page } from "$app/stores";
    //Svelte store which contains page data, including error status
    import Header from "../../../components/Header.svelte";
    //Page header component
</script>

<Header header={"Log in"} pageTitle={"Working Title - Log in"} />
<!--Adds the page header component using the relevant parameters-->

<main>
    <form
        method="post"
        class="login-wrapper"
        use:enhance={({ form, data, action, cancel }) => {
            return async ({ result, update }) => {
                applyAction(result);
            };
        }}
    >
	    <!--The HTML form used to update account data. use:enhance is a svelteKit function, which I use to fill the input fields with the form data submitted once the form is submitted-->
        <label for="email">Email</label>
        <input
            type="email"
            id="email"
            name="email"
            class:error={$page.status === 400}
        />
		<!--Sets class to error if error 400 is returned from the page.server file, this formats the input field border in red-->
        <label for="password">Password</label>
        <input
            type="password"
            id="password"
            name="password"
            class:error={$page.status === 400}
        />
        <button type="submit">Sign in</button>
        {#if $page.status === 400}
            <div class="error-message-wrapper">
                Username or password not found
            </div>
			<!--Div only appears if the page.server file returns an error 400-->
        {/if}
    </form>
    <p>or</p>
    <a href="/account/create">Create an account</a>
</main>

<style>
    .login-wrapper {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        text-align: center;
        width: 20%;
        background-color: #d9d9d9;
        padding: 5px 15px;
        margin: 15px;
        margin-bottom: 0px;
    }

    .login-wrapper > * {
        margin: 5px 0px;
    }

    input,
    button {
        width: 100%;
    }

    main {
        display: flex;
        flex-direction: column;
        justify-content: space-evenly;
        align-items: center;
    }

    a {
        text-decoration: none;
        background-color: hsl(0, 0%, 85%);
        padding: 1px 2px;
        border-width: 2px;
        border-radius: 3px;
        border-style: solid;
        border-color: hsl(0, 0%, 85%);
        color: black;
    }

    a:hover {
        background-color: hsl(0, 0%, 65%);
        border-color: hsl(0, 0%, 65%);
    }

    p {
        margin: 5px;
    }

    .error-message-wrapper {
        height: fit-content;
    }
</style>
