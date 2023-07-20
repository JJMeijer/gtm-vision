<script lang="ts">
    export let title: string;
</script>

<div class="bg-white rounded-md shadow-sm border-zinc-200 border flex flex-col">
    <p class="border-b py-3 px-5 border-zinc-300">{title}</p>
    <div class="flex flex-col py-4 px-8">
        <slot />
    </div>
</div>
