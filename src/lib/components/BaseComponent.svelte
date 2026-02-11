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
    class= "base-field  {noBackground ? "no-bg" : ""}"
  style={cssVars + ($$restProps.style ? " " + $$restProps.style : "")}
  id={id}
  {...$$restProps}
>
  <div class="label"><slot name="label">{label}</slot></div>
  <div class="content"><slot /></div>
</div>

<!-- styles moved to src/lib/styles.css -->
