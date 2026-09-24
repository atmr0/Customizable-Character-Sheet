import { writable } from 'svelte/store';
import { default as defaultTheme } from './theme.js';

export const themeStore = writable(defaultTheme);

export default themeStore;
