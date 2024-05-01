<script lang="ts">
    import StringField from "./StringField.svelte";

    export let variable: string;
    export let operator: string;
    export let value: string;
</script>

<div class="flex flex-row mb-2 items-center w-full">
    <div class="w-[38%]">
        <StringField value={variable} />
    </div>

    <p class="w-[24%] text-center">{operator}</p>

    <div class="w-[38%]">
        <StringField {value} />
    </div>
</div>
