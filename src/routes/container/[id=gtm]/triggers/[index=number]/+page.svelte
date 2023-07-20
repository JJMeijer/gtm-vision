<script lang="ts">
    import { ComponentView } from "$components";
    import type { PageData } from "./$types";

    export let data: PageData;
</script>

<ComponentView data={{ component: data.trigger, type: "Trigger" }}/>
