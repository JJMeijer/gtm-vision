<script lang="ts">
    import { getContext } from "svelte";
    import { page } from "$app/stores";

    import type { ResolvedContainer } from "$lib/gtm/types";
    import { getComponentLink } from "$lib/utility";
    import { GTM_REGEXP } from "$constants";

    const resolvedContainer = getContext<ResolvedContainer>($page.params.id);

    export let value: string | number;
</script>

<p class="py-1.5 px-3 min-h-9 rounded-md border border-zinc-300 whitespace-pre overflow-x-scroll scrollbar-none w-full">
    {#each String(value)
        .split(/({{.+?}})/)
        .filter((x) => x) as part}
        {#if part.match(/^{{/)}
            <a
                href={getComponentLink(part, resolvedContainer)}
                class="text-zinc-700 py-0.5 hover:border-zinc-500 border-b border-transparent"
            >
                {part}
            </a>
        {:else if part.match(GTM_REGEXP)}
            <a href="/container/{part}/" class="text-blue-900 py-0.5 hover:border-blue-900 border-b border-transparent">
                {part}
            </a>
        {:else}
            <span class="text-zinc-700">{part}</span>
        {/if}
    {/each}
</p>
