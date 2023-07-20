<script lang="ts">
    import { page } from "$app/stores";

    export let href: string;
    export let label: string;

    $: active = $page.url.pathname.match(href) !== null;
</script>

<a class={`${active ? "border-b-2 text-blue-600" : ""} border-blue-600 p-3 text-center w-24 `} {href}>{label}</a>
