<script lang="ts">
    export let title: string;
    export let size: string = "";
</script>

<div class="bg-white rounded-md shadow-sm border-zinc-200 border flex flex-col">
    <div class="flex flex-row items-center justify-between border-b py-3 px-5 border-zinc-300">
        <p>{title}</p>
        {#if size}
            <p class="text-sm text-zinc-500">Size: {size}kb</p>
        {/if}

    </div>
    <div class="flex flex-col py-4 px-8">
        <slot />
    </div>
</div>
