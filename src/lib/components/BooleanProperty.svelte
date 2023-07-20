<script lang="ts">
    export let name: string;
    export let value: boolean;
</script>

<div class="flex flex-row mb-3 gap-1 items-center">
    <input type="checkbox" checked={value} class="mx-2 pointer-events-none" />
    <p class="text-zinc-80">{name}</p>
</div>
