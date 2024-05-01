<script lang="ts">
    import { getContext } from "svelte";
    import { page } from "$app/stores";

    import type { ResolvedContainer } from "$lib/gtm/types";
    import { getComponentLink } from "$lib/utility";

    export let name: string;
    export let type: "Tag" | "Trigger" | "Variable" | "Exception";

    const colorLookup = {
        Tag: "border-amber-500 bg-amber-100/50 hover:bg-amber-100",
        Trigger: "border-cyan-500 bg-cyan-100/50 hover:bg-cyan-100",
        Exception: "border-rose-500 bg-rose-100/50 hover:bg-rose-100",
        Variable: "border-emerald-500 bg-emerald-100/50 hover:bg-emerald-100",
    };

    $: colors = colorLookup[type];

    const resolvedContainer = getContext<ResolvedContainer>($page.params.id);
</script>

<a class="py-1 px-3 border-2 rounded-xl {colors}" href={getComponentLink(name, resolvedContainer)}>{name}</a>
