<script lang="ts">
    import type { ResolvedTrigger } from "$lib/gtm/types";

    import ReferencesList from "./ReferencesList.svelte";

    export let component: ResolvedTrigger;

    $: tags = [...(component.tags || []), ...(component.exceptions || [])];
</script>

{#if tags.length > 0}<ReferencesList title="Tags" references={tags} type="Tag" />{:else}<p class="text-gray-500 italic">
        None
    </p>{/if}
