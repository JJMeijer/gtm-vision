<script lang="ts">
    import type { ListOfResolvedBoundaries } from "$lib/gtm/types";
    import Condition from "./Condition.svelte";
    import Dropdown from "./Dropdown.svelte";

    export let name: string;
    export let value: ListOfResolvedBoundaries;

    $: ([_first, ...rest] = value);
</script>

<Dropdown {name} border={true}>
    <div class="flex flex-col px-6 gap-0.5 pb-2">
        {#each rest as [, operator, variable, value ]}
            <Condition {...{operator, variable, value}} />
        {/each}
    </div>
</Dropdown>
