<script lang="ts">
    import { ComponentView } from "$components";
    import type { PageData } from "./$types";

    export let data: PageData;

    $: console.log(data.tag.consent);
</script>

<ComponentView data={{ component: data.tag, type: "Tag" }} />
