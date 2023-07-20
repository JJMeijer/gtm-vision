<script lang="ts">
    import type { ResolvedTrigger } from "$lib/gtm/types";

    import ReferencesList from "./ReferencesList.svelte";

    export let component: ResolvedTrigger;

    $: tags = [...(component.tags || []), ...(component.exceptions || [])];
</script>

<ReferencesList title="Tags" references={tags} type="Tag" />
