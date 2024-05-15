import type { ResolvedMacro, ResolvedTag, ResolvedTrigger } from "$lib/gtm/types";

export type ComponentType = "Tag" | "Trigger" | "Variable";

interface TagComponentData {
    type: "Tag";
    component: ResolvedTag;
}

interface TriggerComponentData {
    type: "Trigger";
    component: ResolvedTrigger;
}

interface VariableComponentData {
    type: "Variable";
    component: ResolvedMacro;
}

export type ComponentData = TagComponentData | TriggerComponentData | VariableComponentData;

interface TagComponentsData {
    type: "Tag";
    components: ResolvedTag[];
}

interface TriggerComponentsData {
    type: "Trigger";
    components: ResolvedTrigger[];
}

interface VariableComponentsData {
    type: "Variable";
    components: ResolvedMacro[];
}

export type ComponentsData = TagComponentsData | TriggerComponentsData | VariableComponentsData;
