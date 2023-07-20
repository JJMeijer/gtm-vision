<script lang="ts">
    import type { ResolvedTagSequencing } from "$lib/gtm/types";

    import Dropdown from "./Dropdown.svelte";
    import BooleanProperty from "./BooleanProperty.svelte";
    import StringProperty from "./StringProperty.svelte";

    export let tagSequencing: ResolvedTagSequencing;

    $: ({ setup, teardown } = tagSequencing);
</script>

<div class="flex flex-col">
    <Dropdown name="Tag Sequencing" border={false}>
        <div class="flex flex-col px-8">
            {#if setup}
                <StringProperty name="Setup Tag" value={setup.tag} />
                {#if setup.optionText}
                    <BooleanProperty name={setup.optionText} value={true} />
                {/if}
            {/if}

            {#if setup && teardown}<div class="w-80 border-b border-zinc-300 border-dashed my-4" />{/if}

            {#if teardown}
                <StringProperty name="Cleanup Tag" value={teardown.tag} />
                {#if teardown.optionText}
                    <BooleanProperty name={teardown.optionText} value={true} />
                {/if}
            {/if}
        </div>
    </Dropdown>
</div>
