<script lang="ts">
    import StringField from "./StringField.svelte";

    export let name: string;
    export let value: string | number;
</script>

<div class="flex flex-col w-80 mb-4 gap-0.5">
    <p class="text-sm text-zinc-500 pl-0.5">{name}:</p>
    <StringField {value} />
</div>
