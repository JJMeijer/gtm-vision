<script lang="ts">
    import { IconChevron } from "./icons";

    export let name: string;
    export let border: boolean;

    let open = false;

    const toggleOpen = () => {
        open = !open;
    };
</script>

<div class={`flex flex-col border-zinc-300/60 ${border && "border-b"}`}>
    <div on:click={toggleOpen} on:keypress={toggleOpen} class="flex flex-row items-end py-4 cursor-pointer">
        <IconChevron
            class={`h-5 w-5 text-zinc-600/70 transition ease-in-out duration-200 mr-3 ${open && "rotate-90"}`}
        />
        <p class="">{name}</p>
    </div>
    <div>
        {#if open}
            <slot />
        {/if}
    </div>
</div>
