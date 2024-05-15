<script lang="ts">
    import type { ListOfResolvedBoundaries, ListOfResolvedMaps, ResolvedMap, ResolvedProperties } from "$lib/gtm/types";

    import type { ComponentType } from "./types";

    import CodeProperty from "./CodeProperty.svelte";
    import StringProperty from "./StringProperty.svelte";
    import BooleanProperty from "./BooleanProperty.svelte";
    import ListOfMapsProperty from "./ListOfMapsProperty.svelte";
    import MapProperty from "./MapProperty.svelte";
    import ListOfBoundariesProperty from "./ListOfBoundariesProperty.svelte";

    export let properties: ResolvedProperties;
    export let componentType: ComponentType;

    $: propertiesEntries = Object.entries(properties);

    $: codeProperties = propertiesEntries.filter(([key, value]) => {
        return ["html", "javascript"].includes(key) && typeof value === "string";
    }) as ["html" | "javascript", string][];

    $: stringProperties = propertiesEntries.filter(([key, value]) => {
        return !["html", "javascript"].includes(key) && (typeof value === "string" || typeof value === "number");
    }) as [string, string | number][];

    $: booleanProperties = propertiesEntries.filter(([, value]) => {
        return typeof value === "boolean";
    }) as [string, boolean][];

    $: mapProperties = propertiesEntries.filter(([, value]) => {
        return Array.isArray(value) && value[0] === "map";
    }) as [string, ResolvedMap][];

    $: listOfMapsProperties = propertiesEntries.filter(([, value]) => {
        return Array.isArray(value) && value[0] === "list" && Array.isArray(value[1]) && value[1][0] === "map";
    }) as [string, ListOfResolvedMaps][];

    $: listOfBoundaryProperties = propertiesEntries.filter(([, value]) => {
        return Array.isArray(value) && value[0] === "list" && Array.isArray(value[1]) && value[1][0] === "zb";
    }) as [string, ListOfResolvedBoundaries][];

    $: if (
        propertiesEntries.length >
        codeProperties.length +
            stringProperties.length +
            booleanProperties.length +
            mapProperties.length +
            listOfMapsProperties.length
    ) {
        console.warn("Some properties were not rendered:", propertiesEntries);
    }
</script>

<div class="flex flex-col">
    {#each codeProperties as [key, value]}
        <CodeProperty code={value} language={key} {componentType} />
    {/each}

    {#each stringProperties as [name, value]}
        <StringProperty {name} {value} />
    {/each}

    {#each booleanProperties as [key, value]}
        <BooleanProperty name={key} {value} />
    {/each}

    {#each listOfBoundaryProperties as [name, value]}
        <ListOfBoundariesProperty {name} {value} />
    {/each}

    {#each listOfMapsProperties as [name, value], index}
        <ListOfMapsProperty {name} {value} last={index + 1 === listOfMapsProperties.length} />
    {/each}

    {#each mapProperties as [key, value]}
        <MapProperty name={key} {value} />
    {/each}
</div>
