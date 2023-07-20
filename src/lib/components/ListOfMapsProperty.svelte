<script lang="ts">
    import type { ListOfResolvedMaps, ResolvedMap } from "$lib/gtm/types";
    import Dropdown from "./Dropdown.svelte";
    import List from "./List.svelte";

    export let name: string;
    export let value: ListOfResolvedMaps;
    export let last: boolean;

    $: columnNames = value[1].filter((_value, index) => index % 2 !== 0);
    $: rows = (value.slice(1) as ResolvedMap[]).map((row) => {
        return row.filter((_value, index) => index && index % 2 === 0);
    });
</script>

<Dropdown {name} border={!last}>
    <List {columnNames} {rows} />
</Dropdown>
