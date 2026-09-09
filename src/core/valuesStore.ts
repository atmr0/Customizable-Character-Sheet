import { writable, Writable } from 'svelte/store';

export type ValuesMap = Record<string, any>;

export const valuesStore: Writable<ValuesMap> = writable({});

export function setValue(id: string, value: any) {
  valuesStore.update(s => ({ ...s, [id]: value }));
}

export default valuesStore;
