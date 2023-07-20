<script lang="ts">
    import StringField from "./StringField.svelte";

    export let columnNames: string[];
    export let rows: string[][];
</script>

<div class="flex flex-col px-6">
    <div class="flex flex-row w-full gap-4 mb-2">
        {#each columnNames as columnName}
            <p class="w-96 text-sm text-zinc-500 pl-0.5">{columnName}</p>
        {/each}
    </div>
    {#each rows as row}
        <div class="flex flex-row w-full gap-4 mb-4">
            {#each row as value}
                <div class="w-96">
                    <StringField {value} />
                </div>
            {/each}
        </div>
    {/each}
</div>
