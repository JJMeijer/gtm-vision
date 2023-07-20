<script lang="ts">
    import { page } from "$app/stores";
    import { Search } from "$components";
    import IconGtm from "$components/icons/IconGtm.svelte";
    import { GtmIdError } from "$constants";

    $: gtmId = $page.url.searchParams.get("gtmId") || undefined;
    $: gtmIdError = $page.url.searchParams.get("gtmIdError") as GtmIdError || undefined;

    const errorMessages: Record<GtmIdError, (id: string) => string> = {
        [GtmIdError.NotFound]: (id) => `Could not find a GTM container with ID '${id}'`,
        [GtmIdError.ParseError]: (id) => `Unexpected error occurred while parsing GTM container with ID '${id}'`,
    };

    $: errorMessage = gtmIdError && gtmId ? errorMessages[gtmIdError](gtmId) : undefined;
</script>

<div class="flex flex-col items-center relative overflow-hidden h-full">
    <div class="z-10 flex flex-col gap-16 p-40 items-center">
        <div class="flex flex-col gap-4 items-center">
            <p class="text-3xl font-semibold">GTM Vision</p>
            <p class="text-xl">Analyze any client-side GTM Container</p>
        </div>

        <Search value={gtmId} />

        {#if errorMessage}
            <p class="text-red-600/90">{errorMessage}</p>
        {/if}
    </div>
    <IconGtm class="w-[40rem] h-[40rem] absolute opacity-[15%] left-[15%] top-[15%]" />
</div>
