<script>
    import { navigating } from "$app/stores";
    import { LoadingSpinner } from "$components";
    import "../app.css";
</script>

<svelte:head>
    <title>GTM Vision</title>
    <meta name="description" content="Analyze any client-side GTM Container" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <link rel="icon" type="image/svg" href="/favicon.ico" />
</svelte:head>

<div class="h-full w-full bg-zinc-200 text-zinc-900">
    <slot />
    {#if $navigating}
        <LoadingSpinner />
    {/if}
</div>
