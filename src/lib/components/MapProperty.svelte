<script lang="ts">
    import type { ResolvedMap } from "$lib/gtm/types";
    import Dropdown from "./Dropdown.svelte";
    import List from "./List.svelte";

    export let name: string;
    export let value: ResolvedMap;

    $: values = value.slice(1).reduce(
        (result, value, index, arr) => {
            if (index % 2 === 0) {
                result[value] = arr[index + 1];
            }
            return result;
        },
        {} as Record<string, string>,
    );

    $: columnNames = ["Key", "Value"];
    $: rows = Object.entries(values);
</script>

<Dropdown {name} border={false}>
    <List {columnNames} {rows} />
</Dropdown>
