<script lang="ts">
    import type { ComponentsData } from "./types";
    import { IconClose } from "./icons";
    import { page } from "$app/stores";
    import { onDestroy, onMount } from "svelte";
    import { isObject } from "$lib/gtm/type-guards";
    import type { GenericObject } from "$lib/gtm/types";

    export let data: ComponentsData;

    let query = "";

    /**
     * Cast the components to a minimal component type to avoid union type errors.
     * This is not nice.
     */
    interface MinimalComponent {
        name: string;
        index: number;
    }

    /**
     * recursive search in all values of an object
     */
    const search: (component: MinimalComponent | GenericObject, query: string) => boolean = (component) => {
        return Object.values(component).some((value) => {
            if (isObject(value)) {
                return search(value, query);
            }

            if (typeof value === "string") {
                return value.toLowerCase().includes(query.toLowerCase());
            }
        });
    };

    $: filteredComponents = (data.components as MinimalComponent[]).filter((component) => search(component, query));

    $: sortedComponents = filteredComponents.sort((a, b) =>
        a.name.localeCompare(b.name, undefined, { numeric: true, sensitivity: "base" }),
    );

    let clearQuery = () => {
        query = "";
    };

    const scrollToComponent = (index: string) => {
        if (typeof document !== "undefined") {
            const element = document.getElementById(`component-link-${index}`);

            if (element) {
                setTimeout(() => {
                    const { bottom, top } = element.getBoundingClientRect();

                    if (bottom > window.innerHeight || top < 0) {
                        element.scrollIntoView({ behavior: "auto", block: "center" });
                    }
                }, 1);
            }
        }
    };

    const scrollToFirstComponent = () => {
        if (typeof document !== "undefined") {
            const element = document.querySelector("#components-list a");

            if (element) {
                setTimeout(() => {
                    element.scrollIntoView({ behavior: "auto", block: "center" });
                }, 1);
            }
        }
    };

    const unsubscribe = page.subscribe(({ params }) => {
        const { index } = params;
        scrollToComponent(index);
    });

    onMount(() => {
        scrollToComponent($page.params.index);
    });

    onDestroy(() => {
        unsubscribe();
    });
</script>

<div class="w-[340px] min-w-[340px] h-full p-2 bg-white rounded-md flex flex-col shadow-xl">
    <div class="flex flex-row w-full justify-center relative">
        <input
            bind:value={query}
            on:input={scrollToFirstComponent}
            type="text"
            class="w-11/12 h-8 p-2 mb-1 border-b border-zinc-300 text-zinc-600 outline-none focus:border-zinc-400"
            placeholder="Search.."
        />
        <div
            on:click={clearQuery}
            on:keypress={clearQuery}
            class="absolute right-4 inset-y-0 h-full flex items-center pb-1.5"
        >
            <IconClose class="h-4 w-4 text-zinc-400 hover:text-zinc-500 cursor-pointer {!query && 'hidden'}" />
        </div>
    </div>
    <div
        id="components-list"
        class="w-full flex-grow min-h-0 flex flex-col overflow-y-scroll scrollbar-thin hover:scrollbar-track-neutral-100 scrollbar-track-neutral-100/50 scrollbar-thumb-neutral-200 scrollbar-track-rounded-lg scrollbar-thumb-rounded-lg"
    >
        {#each sortedComponents as { index, name }}
            <a
                id={`component-link-${index}`}
                href={`${index}`}
                class="p-2 hover:bg-zinc-100 {$page.params.index == String(index) && 'bg-zinc-100 rounded-sm'}"
                >{name}</a
            >
        {/each}
    </div>
</div>
