<script lang="ts">
    import { page } from "$app/stores";

    import { historyStore } from "$lib/stores";
    import { Search } from "$components";
    import IconGtm from "$components/icons/IconGtm.svelte";
    import { GtmIdError } from "$constants";

    $: gtmId = $page.url.searchParams.get("gtmId") || undefined;
    $: gtmIdError = ($page.url.searchParams.get("gtmIdError") as GtmIdError) || undefined;

    const errorMessages: Record<GtmIdError, (id: string) => string> = {
        [GtmIdError.NotFound]: (id) => `Could not find a GTM container with ID '${id}'`,
        [GtmIdError.ParseError]: (id) => `Unexpected error occurred while parsing GTM container with ID '${id}'`,
    };

    $: errorMessage = gtmIdError && gtmId ? errorMessages[gtmIdError](gtmId) : undefined;
</script>

<div class="flex flex-col items-center relative overflow-hidden h-full">
    <div class="z-10 flex flex-col gap-16 pt-52 items-center">
        <div class="flex flex-col gap-4 items-center">
            <p class="text-4xl font-semibold">GTM Vision</p>
            <p class="text-2xl">Analyze client-side GTM Containers</p>
        </div>

        <div class="flex flex-col gap-2">
            <Search value={gtmId} />

            {#if $historyStore.containers.length > 0}
                <div class="flex-inline w-96 gap-2">
                    {#each $historyStore.containers as container, index}
                        <a href={`/container/${container}/tags/`} class="text-blue-600 hover:underline">
                            {container}
                        </a>
                        {#if index < $historyStore.containers.length - 1}
                            <span class="text-neutral-800">/&nbsp;</span>
                        {/if}
                    {/each}
                </div>
            {/if}
        </div>

        {#if errorMessage}
            <p class="text-red-600/90">{errorMessage}</p>
        {/if}
    </div>
    <IconGtm class="w-[40rem] h-[40rem] absolute opacity-[10%] left-[15%] top-[15%]" />
</div>
