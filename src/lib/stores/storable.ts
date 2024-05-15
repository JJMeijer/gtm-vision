import { browser } from "$app/environment";
import { writable } from "svelte/store";

export const storable = <T>(data: T, name: string) => {
    const store = writable<T>(data);
    const { subscribe, set } = store;

    if (browser) {
        const json = localStorage.getItem(name);
        if (json) {
            set(JSON.parse(json));
        }

        subscribe((current) => {
            localStorage.setItem(name, JSON.stringify(current));
        });
    }

    return store;
};
