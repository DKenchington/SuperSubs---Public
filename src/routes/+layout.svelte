<script lang="ts">
	import Navbar from "../components/Navbar.svelte";
	import Footer from "../components/Footer.svelte";
	import "../app.css";
	import type { PageData } from "./$types";

	export let data: PageData;
</script>

<Navbar loggedIn={!!data.sessionID} />

<div class="slot-wrapper">
	<slot />
</div>

<Footer />

<style>
	.slot-wrapper{
		padding-bottom: 53.5px;
	}
</style>

<!--This file defines the layout of each page. <slot/> is where the content of each page will be rendered-->