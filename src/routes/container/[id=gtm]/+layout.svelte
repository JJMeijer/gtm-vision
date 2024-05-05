<script lang="ts">
    import { Search, TopNavLink } from "$components";
    import { setContext } from "svelte";
    import type { LayoutServerData } from "./$types";
    import { browser } from "$app/environment";

    export let data: LayoutServerData;

    $: ({ id, resolvedContainer } = data);

    $: browser && console.log(resolvedContainer.runtime);

    $: setContext(id, resolvedContainer);
</script>

<div class="flex flex-col w-full h-full">
    <div class="flex flex-col w-full bg-white shadow-md border-zinc-300/80">
        <div class="flex flex-row w-full justify-between items-center border-b">
            <a href="/" class="flex items-center justify-center border-r px-6 py-4">
                <p class="font-semibold text-2xl text-zinc-700">GTM Vision</p>
            </a>
            <div class="flex items-center px-8">
                <Search value={id} />
            </div>
        </div>
        <div class="flex flex-row px-4 gap-2">
            <TopNavLink href={`/container/${id}/tags/`} label="Tags" />
            <TopNavLink href={`/container/${id}/triggers/`} label="Triggers" />
            <TopNavLink href={`/container/${id}/variables/`} label="Variables" />
        </div>
    </div>
    <slot />
</div>
