import { get } from "svelte/store";
import { storable } from "./storable";

interface UnminifiedStore {
    [key: string]: Record<string, string>;
}

export const unminifiedStore = storable<UnminifiedStore>({}, "unminified-store");

export const addUnminified = (containerId: string, name: string, code: string) => {
    unminifiedStore.update((store) => ({
        ...store,
        [containerId]: {
            ...store[containerId],
            [name]: code,
        },
    }));
};

export const unMinifiedStoreVersionCheck = (containerId: string, version: string) => {
    const store = get(unminifiedStore);

    if (!store[containerId]) {
        return;
    }

    const currentVersion = store[containerId]?.version;

    if (currentVersion === version) {
        return;
    }

    unminifiedStore.update((store) => ({
        ...store,
        [containerId]: {
            version,
        },
    }));
};
