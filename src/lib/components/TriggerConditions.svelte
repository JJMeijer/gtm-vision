<script lang="ts">
    import type { ResolvedCondition } from "$lib/gtm/types";
    import Condition from "./Condition.svelte";

    import TitledWrapper from "./TitledWrapper.svelte";

    export let conditions: ResolvedCondition[];
</script>

<TitledWrapper title="Conditions">
    {#each conditions as condition}
        <Condition {...condition} />
    {/each}
</TitledWrapper>
