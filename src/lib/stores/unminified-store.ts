import type { ComponentType } from "$components/types";
import { storable } from "./storable";

interface UnminifiedContainer {
    Tag: Record<string, string>;
    Variable: Record<string, string>;
    Trigger: Record<string, string>;
}

interface UnminifiedStore {
    [key: string]: UnminifiedContainer;
}

export const unminifiedStore = storable<UnminifiedStore>({}, "unminified-store");

export const addUnminified = (containerId: string, componentType: ComponentType, id: string, code: string) => {
    unminifiedStore.update((store) => ({
        ...store,
        [containerId]: {
            ...store[containerId],
            [componentType]: {
                ...store[containerId]?.[componentType],
                [id]: code,
            },
        },
    }));
};
