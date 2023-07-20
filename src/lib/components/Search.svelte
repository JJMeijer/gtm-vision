<script lang="ts">
    import { goto } from "$app/navigation";
    import { GTM_REGEXP } from "$constants";

    export let value = "";

    let input: HTMLInputElement;

    const onSubmit = (event: Event) => {
        event.preventDefault();

        if (!value) {
            input.setCustomValidity("Please enter a GTM ID");
            input.reportValidity();
            return;
        }

        if (!GTM_REGEXP.test(value)) {
            input.setCustomValidity("Please enter a valid GTM ID");
            input.reportValidity();
            return;
        }

        goto(`/container/${value}/tags/`);
    };
</script>

<form
    on:submit={onSubmit}
    class="flex flex-row items-center h-11 border-zinc-800/50 border focus-within:border-2 focus-within:border-blue-600 rounded-lg bg-zinc-100 overflow-clip"
>
    <input
        name="id"
        type="text"
        placeholder="Search.."
        autocomplete="off"
        bind:value
        bind:this={input}
        class="px-3 py-3 w-80 bg-transparent h-full outline-none text-neutral-800/50 focus:text-neutral-800"
    />
    <button type="submit" class="h-full w-24 bg-blue-600 hover:bg-blue-700 text-neutral-200"> Analyze </button>
</form>
