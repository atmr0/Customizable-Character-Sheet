<script lang="ts">
  import { defaultTheme, themeToCssVars } from "../theme.js";
  import { themeStore } from "../themeStore.js";
  import { get } from "svelte/store";

  export let theme = null; // allow override via prop
  export let id: string | undefined;
  export let label: string | undefined;
  export let noBackground: boolean = true;
  export let componentClass = ''; 

  // allows for better styling other components
  // other components will have a class that can be used for styling inner elements
  if(componentClass) componentClass = componentClass+"-wrapper";
  $: appliedTheme = theme
    ? { ...defaultTheme, ...theme }
    : get(themeStore) || defaultTheme;
  $: cssVars = themeToCssVars(appliedTheme);
</script>

<div
  class="base-component {noBackground ? 'no-bg' : ''} {componentClass}"
  {id}
  {...$$restProps}
>
  {#if label}
    <slot name="label"><div class="label">{label}</div></slot>
  {/if}
  <slot />
</div>
