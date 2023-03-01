<script lang="ts">
    export let header: any;
    export let pageTitle: any;
</script>

<svelte:head>
    <title>{pageTitle}</title>
</svelte:head>
<!--svelte:head is a svelteKit feature which allows tags to be inserted into the <head> of a page, e.g title, meta, etc.-->

<div class="header-wrapper">
    <h1>{header}</h1>
</div>
<!--This is the header component, which takes two arguments of header and pageTitle when called as a component-->

<style>
    .header-wrapper {
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #3C6E71;
        height: 60px;
    }

    h1 {
        color: #ffffff;
        font-weight: 300;
        margin: 0px;
    }
</style>