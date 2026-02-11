<script lang="ts">
  import { defaultTheme, themeToCssVars } from "../theme.js";
  import { themeStore } from "../themeStore.js";
  import { get } from "svelte/store";

  export let theme = null; // allow override via prop
  export let id: string | undefined;
  export let label: string | undefined;
  export let noBackground: boolean = true; // when true, render without background/border/shadow

  $: appliedTheme = theme
    ? { ...defaultTheme, ...theme }
    : get(themeStore) || defaultTheme;
  $: cssVars = themeToCssVars(appliedTheme);
</script>

<div
  class="base-component {noBackground ? 'no-bg' : ''}"
  {id}
  {...$$restProps}
>
  {#if label}
    <slot name="label"><div class="label">{label}</div></slot>
  {/if}
  <slot />
</div>
