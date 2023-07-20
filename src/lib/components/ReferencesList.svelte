<script lang="ts">
    import ReferenceButton from "./ReferenceButton.svelte";
    import TitledWrapper from "./TitledWrapper.svelte";

    export let title: string;
    export let references: string[];
    export let type: "Tag" | "Trigger" | "Variable" | "Exception";
</script>

<TitledWrapper {title}>
    <div class="flex flex-row flex-wrap gap-4">
        {#each references as reference}
            <ReferenceButton name={reference} {type} />
        {/each}
    </div>
</TitledWrapper>
