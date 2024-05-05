<script lang="ts">
    import TitledWrapper from "./TitledWrapper.svelte";

    export let consent: string[];
</script>

<div class="border-t my-2 py-2">
    <TitledWrapper title="Consent Mode Requirements">
        <div class="flex flex-row flex-wrap gap-4 mt-1">
            {#each consent as reference}
                <span class="flex items-center text-sm text-zinc-700 bg-sky-100 px-3 py-1 rounded-full">{reference}</span>
            {/each}
        </div>
    </TitledWrapper>
</div>
