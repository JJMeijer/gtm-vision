<script lang="ts">
    import ComponentLayout from "$components/ComponentLayout.svelte";
    import ComponentsList from "$components/ComponentsList.svelte";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;
</script>

<ComponentLayout>
    <ComponentsList  data={{ components: data.resolvedContainer.triggers, type: "Trigger"}} />
    <slot />
</ComponentLayout>
