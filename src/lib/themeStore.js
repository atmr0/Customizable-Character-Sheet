import { writable } from 'svelte/store';
import defaultTheme from './theme.js';

// Writable store to allow dynamic theming at runtime.
export const themeStore = writable(defaultTheme);

export default themeStore;
