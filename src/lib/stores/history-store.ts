import { storable } from "./storable";

interface HistoryStore {
    containers: string[];
}

export const historyStore = storable<HistoryStore>({ containers: [] }, "history-store");

export const addHistory = (container: string) => {
    historyStore.update((store) => {
        store.containers = [container, ...store.containers]
            .filter((id, index, arr) => arr.indexOf(id) === index)
            .slice(0, 3);
        return store;
    });
};
