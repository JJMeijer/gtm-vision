<script lang="ts">
    import { ComponentsList, ComponentLayout } from "$components";
    import type { LayoutData } from "./$types";

    export let data: LayoutData;
</script>

<ComponentLayout>
    <ComponentsList data={{ components: data.resolvedContainer.variables, type: "Variable" }} />
    <slot />
</ComponentLayout>
