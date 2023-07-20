<script lang="ts">
    import { getContext } from "svelte";
    import { page } from "$app/stores";

    import type { ResolvedContainer, ResolvedTag } from "$lib/gtm/types";

    import ReferencesList from "./ReferencesList.svelte";

    export let component: ResolvedTag;

    const resolvedContainer = getContext<ResolvedContainer>($page.params.id);

    $: tags = component.references.tags;
    $: triggers = component.references.triggers.filter((name) => {
        const trigger = resolvedContainer.triggers.find((trigger) => trigger.name === name);

        if (!trigger) {
            return false;
        }

        return trigger.tags?.includes(`{{${component.name}}}`);
    });

    $: exceptions = component.references.triggers.filter((name) => {
        const trigger = resolvedContainer.triggers.find((trigger) => trigger.name === name);

        if (!trigger) {
            return false;
        }

        return trigger.exceptions?.includes(`{{${component.name}}}`);
    });
</script>

<ReferencesList title="Triggers" references={triggers} type="Trigger" />

{#if exceptions.length > 0}
    <ReferencesList title="Exceptions" references={exceptions} type="Exception" />
{/if}

{#if tags.length > 0}
    <ReferencesList title="Triggered before or after" references={tags} type="Tag" />
{/if}
