import { writable, Writable } from 'svelte/store';
import { Sheet } from './builder';

export type ValuesMap = Record<string, any>;

export const valuesStore: Writable<ValuesMap> = writable({});

let sheet: Sheet | null = null;
export function setSheet(newSheet: Sheet | null) {
  sheet = newSheet;
}
export function updateValueStore(id: string, value: any) {
  valuesStore.update(s => ({ ...s, [id]: value }));
}

export default valuesStore;
