<script lang="ts">
    import type { ResolvedMacro } from "$lib/gtm/types";

    import ReferencesList from "./ReferencesList.svelte";

    export let component: ResolvedMacro;

    $: ({ tags, triggers, variables } = component.references);
</script>

{#if tags.length > 0}<ReferencesList title="Tags" references={tags} type="Tag" />{/if}
{#if triggers.length > 0}<ReferencesList title="Triggers" references={triggers} type="Trigger" />{/if}
{#if variables.length > 0}<ReferencesList title="Variables" references={variables} type="Variable" />{/if}

{#if tags.length === 0 && triggers.length === 0 && variables.length === 0}
    <p class="text-gray-500 italic">None</p>
{/if}
