import { writable } from 'svelte/store';

// Simple store holding a map of fieldId -> value
export const valuesStore = writable({});

export function setValue(id, value){
  valuesStore.update(s => ({ ...s, [id]: value }));
}

export default valuesStore;
