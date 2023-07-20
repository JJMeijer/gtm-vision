<script lang="ts">
    export let title: string;
</script>

<div class="flex flex-col gap-0.5">
    <p class="text-sm text-zinc-500 pl-0.5 pb-1">{title}:</p>
    <slot />
</div>
