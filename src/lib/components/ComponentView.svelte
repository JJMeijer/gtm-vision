<script lang="ts">
    import type { ComponentData } from "./types";

    import TitledContainer from "./TitledContainer.svelte";
    import ComponentProperties from "./ComponentProperties.svelte";

    import TagReferences from "./TagReferences.svelte";
    import TagSequencing from "./TagSequencing.svelte";
    import VariableReferences from "./VariableReferences.svelte";
    import TriggerConditions from "./TriggerConditions.svelte";
    import TriggerReferences from "./TriggerReferences.svelte";
    import TagConsent from "./TagConsent.svelte";

    export let data: ComponentData;
</script>

<div class="flex-grow min-w-0 h-full bg-zinc-100 flex flex-col shadow-xl rounded-md">
    <div class="h-16 border-b w-full text-xl flex flex-row items-center py-4 px-6 bg-white rounded-t-md">
        {data.component.name}
    </div>
    <div
        class="flex flex-col gap-8 min-h-0 flex-grow px-14 py-8 overflow-y-scroll scrollbar-thin scrollbar-track-zinc-200 scrollbar-thumb-neutral-300"
    >
        <TitledContainer title="{data.type} Configuration" size={data.component.size}>
            <ComponentProperties properties={data.component.properties || {}} />

            {#if data.type === "Tag"}
                {#if data.component.tagSequencing}
                    <TagSequencing tagSequencing={data.component.tagSequencing} />
                {/if}

                {#if data.component.consent.length > 0}
                    <TagConsent consent={data.component.consent} />
                {/if}
            {/if}

            {#if data.type === "Trigger"}
                <TriggerConditions conditions={data.component.conditions} />
            {/if}
        </TitledContainer>

        <TitledContainer title={data.type === "Tag" ? "Triggering" : "References"}>
            <div class="flex flex-col gap-4">
                {#if data.type === "Tag"}
                    <TagReferences component={data.component} />
                {/if}

                {#if data.type === "Variable"}
                    <VariableReferences component={data.component} />
                {/if}

                {#if data.type === "Trigger"}
                    <TriggerReferences component={data.component} />
                {/if}
            </div>
        </TitledContainer>
    </div>
</div>
